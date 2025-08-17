# 📚 고등학교 필수 어휘 학습 사이트

AI 기반 플래시카드 및 퀴즈 시스템으로 고등학교 필수 영어 어휘를 효과적으로 학습할 수 있는 웹 애플리케이션입니다.

## 🚀 주요 기능

### 📱 플래시카드 학습
- 인터랙티브한 카드 뒤집기 기능
- 실시간 학습 진도 추적
- 단어별 상세 정보 (발음, 예문, 유의어)
- 학습한 단어 표시

### 🧠 퀴즈 시스템
- 랜덤 10문제 객관식 퀴즈
- 실시간 점수 계산
- 상세한 결과 분석 및 복습 가이드
- 틀린 문제 정답 표시

### 📊 학습 관리
- 진도율 시각화 (프로그레스 바)
- 학습 통계 및 성취도 분석
- 단어별 빠른 네비게이션

## 🛠️ 기술 스택

- **Framework**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **UI Components**: Radix UI 기반 컴포넌트 시스템
- **Build Tool**: Turbopack
- **Development**: ESLint + TypeScript

## 📖 어휘 데이터

현재 15개의 고등학교 필수 어휘가 포함되어 있으며, 각 단어는 다음 정보를 포함합니다:

- 영어 단어 및 한국어 뜻
- 발음 기호
- 품사
- 난이도 (초급/중급/고급)
- 카테고리 분류
- 예문 (2개)
- 유의어/반의어

## 🚀 실행 방법

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 접속 URL
- 개발 서버: http://localhost:3000
- 홈페이지: `/`
- 플래시카드: `/flashcard`
- 퀴즈: `/quiz`

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 홈페이지
│   ├── flashcard/         # 플래시카드 페이지
│   └── quiz/              # 퀴즈 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── VocabCard.tsx     # 어휘 카드 컴포넌트
│   └── Header.tsx        # 헤더 컴포넌트
├── data/                 # 어휘 데이터
│   └── vocab-data.ts     # 샘플 어휘 데이터
├── types/                # TypeScript 타입 정의
│   └── vocab.ts          # 어휘 관련 타입
└── lib/                  # 유틸리티 함수
    └── utils.ts          # 공통 유틸리티
```

## 🎨 디자인 시스템

- **컬러 테마**: 교육적이고 친근한 블루 계열
- **타이포그래피**: 읽기 쉬운 폰트 조합
- **반응형 디자인**: 모바일 우선 설계
- **인터랙션**: 부드러운 애니메이션 및 전환

## 📈 향후 개발 계획

### 단기 목표
- [ ] 더 많은 어휘 데이터 추가 (3000+ 단어)
- [ ] 사용자 계정 시스템
- [ ] 학습 데이터 로컬 저장
- [ ] 다양한 학습 모드 (스펠링, 빈칸 채우기)

### 장기 목표
- [ ] AI 기반 개인화 학습 경로
- [ ] 음성 발음 기능
- [ ] 소셜 학습 기능
- [ ] 모바일 앱 개발

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) - React 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [shadcn/ui](https://ui.shadcn.com/) - UI 컴포넌트 라이브러리
- [Radix UI](https://www.radix-ui.com/) - 접근성 중심 UI 프리미티브

---

🤖 **Generated with [Claude Code](https://claude.ai/code)**

Co-Authored-By: Claude <noreply@anthropic.com>