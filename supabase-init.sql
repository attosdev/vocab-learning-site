-- Enable RLS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS words CASCADE;
DROP TABLE IF EXISTS word_packs CASCADE;
DROP TABLE IF EXISTS pack_tags CASCADE;

-- Create word_packs table
CREATE TABLE word_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'exam', 'topic')),
    description TEXT,
    total_words INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create words table
CREATE TABLE words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pack_id UUID REFERENCES word_packs(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    phonetic TEXT,
    pos TEXT, -- part of speech
    meaning_ko TEXT NOT NULL,
    meaning_en TEXT,
    examples JSONB DEFAULT '[]'::jsonb,
    synonyms TEXT[] DEFAULT '{}',
    antonyms TEXT[] DEFAULT '{}',
    audio_url TEXT,
    tags TEXT[] DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create pack_tags table (optional)
CREATE TABLE pack_tags (
    pack_id UUID REFERENCES word_packs(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    PRIMARY KEY (pack_id, tag)
);

-- Create indexes for better performance
CREATE INDEX words_pack_id_idx ON words(pack_id);
CREATE INDEX words_order_idx ON words(order_index);
CREATE INDEX word_packs_slug_idx ON word_packs(slug);
CREATE INDEX word_packs_level_idx ON word_packs(level);

-- Enable RLS
ALTER TABLE word_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "public_read_packs" ON word_packs
    FOR SELECT USING (is_published = true);

CREATE POLICY "public_read_words" ON words
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM word_packs p
        WHERE p.id = words.pack_id AND p.is_published = true
    ));

CREATE POLICY "public_read_pack_tags" ON pack_tags
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM word_packs p
        WHERE p.id = pack_tags.pack_id AND p.is_published = true
    ));

-- Insert sample data
INSERT INTO word_packs (slug, title, level, description, total_words) VALUES
('basic', 'Basic 500', 'beginner', '일상에서 자주 쓰는 핵심 단어 500개', 20),
('intermediate', 'Intermediate 1000', 'intermediate', '중급 수준의 어휘 1000개', 15),
('toeic', 'TOEIC Essential', 'exam', 'TOEIC 시험 필수 어휘', 25);

-- Get pack IDs for inserting words
DO $$
DECLARE
    basic_pack_id UUID;
    intermediate_pack_id UUID;
    toeic_pack_id UUID;
BEGIN
    SELECT id INTO basic_pack_id FROM word_packs WHERE slug = 'basic';
    SELECT id INTO intermediate_pack_id FROM word_packs WHERE slug = 'intermediate';
    SELECT id INTO toeic_pack_id FROM word_packs WHERE slug = 'toeic';

    -- Insert basic words
    INSERT INTO words (pack_id, term, phonetic, pos, meaning_ko, meaning_en, examples, order_index) VALUES
    (basic_pack_id, 'enormous', '/ɪˈnɔːrməs/', 'adj', '거대한', 'very large', '[{"en": "The ship is enormous.", "ko": "그 배는 거대하다."}]', 1),
    (basic_pack_id, 'benefit', '/ˈbenɪfɪt/', 'n', '이익', 'an advantage', '[{"en": "It will benefit you.", "ko": "그것은 너에게 이익이 된다."}]', 2),
    (basic_pack_id, 'adequate', '/ˈædɪkwət/', 'adj', '적절한', 'sufficient', '[{"en": "The food was adequate.", "ko": "음식은 적절했다."}]', 3),
    (basic_pack_id, 'crucial', '/ˈkruːʃl/', 'adj', '중요한', 'extremely important', '[{"en": "This is a crucial decision.", "ko": "이것은 중요한 결정이다."}]', 4),
    (basic_pack_id, 'examine', '/ɪɡˈzæmɪn/', 'v', '조사하다', 'to inspect', '[{"en": "Please examine this document.", "ko": "이 문서를 조사해 주세요."}]', 5),
    (basic_pack_id, 'establish', '/ɪˈstæblɪʃ/', 'v', '설립하다', 'to set up', '[{"en": "They established a company.", "ko": "그들은 회사를 설립했다."}]', 6),
    (basic_pack_id, 'approach', '/əˈproʊtʃ/', 'v', '접근하다', 'to come near', '[{"en": "Approach the building carefully.", "ko": "건물에 조심스럽게 접근하세요."}]', 7),
    (basic_pack_id, 'available', '/əˈveɪləbl/', 'adj', '이용 가능한', 'ready for use', '[{"en": "The room is available.", "ko": "방이 이용 가능하다."}]', 8),
    (basic_pack_id, 'particular', '/pərˈtɪkjələr/', 'adj', '특별한', 'specific', '[{"en": "This particular case is different.", "ko": "이 특별한 경우는 다르다."}]', 9),
    (basic_pack_id, 'significant', '/sɪɡˈnɪfɪkənt/', 'adj', '중요한', 'important', '[{"en": "A significant improvement.", "ko": "중요한 개선."}]', 10),
    (basic_pack_id, 'contribute', '/kənˈtrɪbjuːt/', 'v', '기여하다', 'to help', '[{"en": "Everyone should contribute.", "ko": "모든 사람이 기여해야 한다."}]', 11),
    (basic_pack_id, 'implement', '/ˈɪmplɪment/', 'v', '실행하다', 'to carry out', '[{"en": "We need to implement this plan.", "ko": "우리는 이 계획을 실행해야 한다."}]', 12),
    (basic_pack_id, 'acquire', '/əˈkwaɪər/', 'v', '얻다', 'to obtain', '[{"en": "She acquired new skills.", "ko": "그녀는 새로운 기술을 얻었다."}]', 13),
    (basic_pack_id, 'demonstrate', '/ˈdemənstreɪt/', 'v', '보여주다', 'to show', '[{"en": "Let me demonstrate how it works.", "ko": "어떻게 작동하는지 보여드리겠습니다."}]', 14),
    (basic_pack_id, 'participate', '/pɑːrˈtɪsɪpeɪt/', 'v', '참여하다', 'to take part', '[{"en": "Everyone can participate.", "ko": "모든 사람이 참여할 수 있다."}]', 15),
    (basic_pack_id, 'authority', '/əˈθɔːrəti/', 'n', '권한', 'power', '[{"en": "He has the authority to decide.", "ko": "그는 결정할 권한이 있다."}]', 16),
    (basic_pack_id, 'category', '/ˈkætəɡɔːri/', 'n', '범주', 'group', '[{"en": "This belongs to a different category.", "ko": "이것은 다른 범주에 속한다."}]', 17),
    (basic_pack_id, 'capacity', '/kəˈpæsəti/', 'n', '용량', 'ability to contain', '[{"en": "The hall has a large capacity.", "ko": "홀은 큰 용량을 가지고 있다."}]', 18),
    (basic_pack_id, 'commission', '/kəˈmɪʃn/', 'n', '위원회', 'committee', '[{"en": "The commission will investigate.", "ko": "위원회가 조사할 것이다."}]', 19),
    (basic_pack_id, 'consequence', '/ˈkɑːnsəkwəns/', 'n', '결과', 'result', '[{"en": "Every action has a consequence.", "ko": "모든 행동에는 결과가 있다."}]', 20);

    -- Insert intermediate words
    INSERT INTO words (pack_id, term, phonetic, pos, meaning_ko, meaning_en, examples, order_index) VALUES
    (intermediate_pack_id, 'hypothesis', '/haɪˈpɑːθəsɪs/', 'n', '가설', 'theory', '[{"en": "The hypothesis needs testing.", "ko": "가설은 검증이 필요하다."}]', 1),
    (intermediate_pack_id, 'sophisticated', '/səˈfɪstɪkeɪtɪd/', 'adj', '정교한', 'complex', '[{"en": "A sophisticated system.", "ko": "정교한 시스템."}]', 2),
    (intermediate_pack_id, 'comprehensive', '/ˌkɑːmprɪˈhensɪv/', 'adj', '포괄적인', 'complete', '[{"en": "A comprehensive study.", "ko": "포괄적인 연구."}]', 3),
    (intermediate_pack_id, 'inevitable', '/ɪnˈevɪtəbl/', 'adj', '불가피한', 'unavoidable', '[{"en": "Change is inevitable.", "ko": "변화는 불가피하다."}]', 4),
    (intermediate_pack_id, 'fundamental', '/ˌfʌndəˈmentl/', 'adj', '기본적인', 'basic', '[{"en": "A fundamental principle.", "ko": "기본적인 원칙."}]', 5);

    -- Insert TOEIC words
    INSERT INTO words (pack_id, term, phonetic, pos, meaning_ko, meaning_en, examples, order_index) VALUES
    (toeic_pack_id, 'accommodate', '/əˈkɑːmədeɪt/', 'v', '수용하다', 'to provide space', '[{"en": "The hotel can accommodate 200 guests.", "ko": "호텔은 200명의 손님을 수용할 수 있다."}]', 1),
    (toeic_pack_id, 'budget', '/ˈbʌdʒɪt/', 'n', '예산', 'financial plan', '[{"en": "We need to review the budget.", "ko": "예산을 검토해야 한다."}]', 2),
    (toeic_pack_id, 'conference', '/ˈkɑːnfərəns/', 'n', '회의', 'meeting', '[{"en": "The conference starts at 9 AM.", "ko": "회의는 오전 9시에 시작한다."}]', 3),
    (toeic_pack_id, 'deadline', '/ˈdedlaɪn/', 'n', '마감일', 'time limit', '[{"en": "The deadline is tomorrow.", "ko": "마감일은 내일이다."}]', 4),
    (toeic_pack_id, 'efficient', '/ɪˈfɪʃnt/', 'adj', '효율적인', 'effective', '[{"en": "An efficient process.", "ko": "효율적인 과정."}]', 5);
END $$;