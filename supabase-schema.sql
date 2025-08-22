-- 사용자 프로필 테이블 (Supabase Auth와 연동)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 어휘 테이블
CREATE TABLE public.vocabulary (
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  definition TEXT NOT NULL,
  pronunciation TEXT,
  part_of_speech TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  category TEXT NOT NULL,
  examples JSONB DEFAULT '[]',
  synonyms JSONB DEFAULT '[]',
  antonyms JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 학습 진도 테이블
CREATE TABLE public.learning_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  word_id INTEGER REFERENCES public.vocabulary(id) ON DELETE CASCADE NOT NULL,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  mastery_level DECIMAL(5,2) DEFAULT 0.0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  streak_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, word_id)
);

-- 퀴즈 세션 테이블
CREATE TABLE public.quiz_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  quiz_type TEXT DEFAULT 'multiple-choice',
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  score DECIMAL(5,2) DEFAULT 0.0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER
);

-- 퀴즈 답변 테이블
CREATE TABLE public.quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE NOT NULL,
  word_id INTEGER REFERENCES public.vocabulary(id) ON DELETE CASCADE NOT NULL,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 학습 세션 테이블 (플래시카드, 복습 등)
CREATE TABLE public.learning_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT CHECK (session_type IN ('flashcard', 'review', 'quiz', 'practice')) NOT NULL,
  words_studied JSONB DEFAULT '[]',
  duration_seconds INTEGER,
  words_learned INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 사용자 성취도 테이블
CREATE TABLE public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  metadata JSONB DEFAULT '{}'
);

-- Row Level Security 활성화
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
CREATE POLICY "Users can view and update own profile" ON public.user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view and update own learning progress" ON public.learning_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and create own quiz sessions" ON public.quiz_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and create own quiz answers" ON public.quiz_answers
  FOR ALL USING (auth.uid() = (SELECT user_id FROM quiz_sessions WHERE id = session_id));

CREATE POLICY "Users can view and create own learning sessions" ON public.learning_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and earn achievements" ON public.user_achievements
  FOR ALL USING (auth.uid() = user_id);

-- 어휘는 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can view vocabulary" ON public.vocabulary
  FOR SELECT USING (true);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_learning_progress_user_id ON public.learning_progress(user_id);
CREATE INDEX idx_learning_progress_word_id ON public.learning_progress(word_id);
CREATE INDEX idx_learning_progress_mastery ON public.learning_progress(mastery_level);
CREATE INDEX idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX idx_quiz_answers_session_id ON public.quiz_answers(session_id);
CREATE INDEX idx_vocabulary_difficulty ON public.vocabulary(difficulty);
CREATE INDEX idx_vocabulary_category ON public.vocabulary(category);

-- 함수: 사용자 프로필 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거: 새 사용자 가입 시 프로필 자동 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 함수: 학습 진도 업데이트
CREATE OR REPLACE FUNCTION public.update_learning_progress(
  p_user_id UUID,
  p_word_id INTEGER,
  p_is_correct BOOLEAN
)
RETURNS VOID AS $$
DECLARE
  current_correct INTEGER := 0;
  current_incorrect INTEGER := 0;
  current_streak INTEGER := 0;
  new_mastery DECIMAL;
BEGIN
  -- 현재 진도 확인
  SELECT correct_count, incorrect_count, streak_count
  INTO current_correct, current_incorrect, current_streak
  FROM public.learning_progress
  WHERE user_id = p_user_id AND word_id = p_word_id;

  -- 진도가 없으면 새로 생성
  IF NOT FOUND THEN
    current_correct := 0;
    current_incorrect := 0;
    current_streak := 0;
  END IF;

  -- 정답/오답에 따라 업데이트
  IF p_is_correct THEN
    current_correct := current_correct + 1;
    current_streak := current_streak + 1;
  ELSE
    current_incorrect := current_incorrect + 1;
    current_streak := 0;
  END IF;

  -- 숙련도 계산 (정답률 + 연속 정답 보너스)
  new_mastery := LEAST(100.0, 
    (current_correct::DECIMAL / GREATEST(1, current_correct + current_incorrect)) * 80 +
    LEAST(20.0, current_streak * 2)
  );

  -- 진도 업데이트 또는 삽입
  INSERT INTO public.learning_progress (
    user_id, word_id, correct_count, incorrect_count, 
    streak_count, mastery_level, last_reviewed, updated_at
  )
  VALUES (
    p_user_id, p_word_id, current_correct, current_incorrect,
    current_streak, new_mastery, NOW(), NOW()
  )
  ON CONFLICT (user_id, word_id)
  DO UPDATE SET
    correct_count = current_correct,
    incorrect_count = current_incorrect,
    streak_count = current_streak,
    mastery_level = new_mastery,
    last_reviewed = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;