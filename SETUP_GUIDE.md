# 어휘 학습 사이트 설정 가이드

이 문서는 Vocabulary Learning Site의 Google OAuth 인증 시스템을 설정하는 방법을 설명합니다.

## 📋 사전 준비사항

- Google Cloud Platform 계정
- Supabase 프로젝트
- Vercel 프로젝트

## 🔧 1. Supabase 설정

### 1.1 Authentication URL 설정

**위치**: `Project Settings > Authentication > URL Configuration`

| 설정 항목 | 값 |
|----------|---|
| **Site URL** | `https://attosvoca.vercel.app` |
| **Redirect URLs** | `https://attosvoca.vercel.app`<br>`https://attosvoca.vercel.app/auth/callback` |

### 1.2 Google Provider 활성화

**위치**: `Authentication > Providers > Google`

1. **Enable Google provider** 체크박스 활성화 ✅
2. **Client ID**: Google Console에서 생성한 클라이언트 ID 입력
3. **Client Secret**: Google Console에서 생성한 클라이언트 시크릿 입력
4. **Save** 클릭

### 1.3 JWT 설정 (선택사항)

**위치**: `Project Settings > API > JWT Settings`

- **JWT expiry**: `3600` (1시간) 또는 원하는 만료 시간(초)

### 1.4 데이터베이스 스키마 적용

프로젝트 루트의 `supabase-schema.sql` 파일을 Supabase SQL Editor에서 실행:

1. Supabase Dashboard → SQL Editor
2. `supabase-schema.sql` 내용 복사 & 붙여넣기
3. **Run** 클릭

## 🔐 2. Google Cloud Console 설정

### 2.1 새 프로젝트 생성 (필요시)

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 상단 프로젝트 선택 드롭다운 → **New Project**
3. 프로젝트 이름 입력 → **Create**

### 2.2 OAuth 2.0 클라이언트 ID 생성

**위치**: `APIs & Services > Credentials`

1. **+ CREATE CREDENTIALS** → **OAuth client ID**
2. 애플리케이션 유형: **Web application** 선택
3. 이름: `Vocabulary Learning Site` (또는 원하는 이름)

### 2.3 승인된 출처 및 리디렉션 URI 설정

#### 승인된 자바스크립트 출처
```
https://attosvoca.vercel.app
```

#### 승인된 리디렉션 URI
```
https://qjxwhimplpbdrfbutwmi.supabase.co/auth/v1/callback
https://attosvoca.vercel.app/auth/callback
```

⚠️ **중요**: Supabase 프로젝트 URL에 맞게 첫 번째 리디렉션 URI를 수정하세요.

### 2.4 OAuth 동의 화면 설정

**위치**: `APIs & Services > OAuth consent screen`

#### 기본 정보
- **User Type**: 
  - 개인/테스트용: **External**
  - 조직 내부용: **Internal**
- **App name**: `Vocabulary Learning Site`
- **User support email**: 본인 이메일 주소
- **App logo**: (선택사항) 앱 로고 업로드

#### 연락처 정보
- **Developer contact information**: 본인 이메일 주소

#### 승인된 도메인 (External 선택시)
```
attosvoca.vercel.app
```

## 🚀 3. Vercel 환경 변수 설정

### 3.1 Vercel Dashboard에서 설정

1. [Vercel Dashboard](https://vercel.com/dashboard) → 프로젝트 선택
2. **Settings** → **Environment Variables**

### 3.2 환경 변수 추가

| 변수 이름 | 값 | 환경 |
|-----------|---|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qjxwhimplpbdrfbutwmi.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 프로젝트의 anon public key | All |

> 💡 **Tip**: Supabase API 키는 `Project Settings > API`에서 확인할 수 있습니다.

## 🔄 4. 인증 플로우 확인

### 4.1 설정 완료 후 테스트 순서

1. **Google OAuth 설정 확인**
   - 승인된 리디렉션 URI가 정확한지 확인
   - OAuth 동의 화면이 올바르게 설정되었는지 확인

2. **Supabase Provider 설정 확인**
   - Google Client ID/Secret이 올바르게 입력되었는지 확인
   - Redirect URLs가 정확한지 확인

3. **Vercel 환경 변수 확인**
   - 환경 변수가 올바르게 설정되었는지 확인
   - 새 배포가 트리거되었는지 확인

### 4.2 인증 플로우

```
사용자 클릭 "Google로 로그인"
    ↓
Google OAuth 페이지로 리디렉트
    ↓
사용자 인증 완료
    ↓
Supabase로 리디렉트 (토큰 처리)
    ↓
애플리케이션으로 최종 리디렉트 (토큰 포함)
    ↓
클라이언트에서 토큰 처리 및 로그인 완료
```

## 🔍 5. 문제 해결

### 5.1 일반적인 오류

#### "redirect_uri_mismatch" 오류
- Google Console의 승인된 리디렉션 URI 확인
- Supabase URL이 정확한지 확인

#### 인증 후 로그인되지 않는 경우
- 브라우저 개발자 도구 콘솔 확인
- 토큰이 URL 해시에 포함되는지 확인
- localStorage에 토큰이 저장되는지 확인

#### 환경 변수 관련 오류
- Vercel에서 환경 변수가 올바르게 설정되었는지 확인
- 새로운 배포가 트리거되었는지 확인

### 5.2 디버깅 도구

브라우저 개발자 도구 콘솔에서 다음 로그를 확인:

```javascript
// 현재 URL 및 해시 확인
console.log('Current URL:', window.location.href)
console.log('Hash:', window.location.hash)

// 토큰 추출 확인
console.log('Extracted tokens:', { accessToken: !!accessToken })

// 사용자 설정 확인
console.log('User set from token:', user.email)
```

## 📞 6. 지원

문제가 발생하는 경우:

1. 브라우저 개발자 도구 콘솔 로그 확인
2. Supabase Dashboard의 Authentication 로그 확인
3. Google Cloud Console의 OAuth 설정 재확인

---

**마지막 업데이트**: 2025-08-18  
**버전**: 1.0.0