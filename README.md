# 특급꿀벌

특급꿀벌은 성향 기반으로 군 직무를 가볍게 탐색하는 한국어 웹서비스 MVP입니다. 결과는 진로 탐색을 돕기 위한 참고 자료이며 실제 선발·보직을 보장하지 않습니다.

## 시작하기

1. Node.js 22 LTS 이상을 설치합니다.
2. `.env.example`을 복사해 `.env.local`을 만들고 Supabase 값을 입력합니다.
3. 의존성을 설치하고 개발 서버를 실행합니다.

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 명령어

```bash
npm run lint
npm run typecheck
npm run build
```

## 환경변수

| 변수 | 사용 위치 | 설명 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | 브라우저·서버 | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 브라우저·서버 | 공개 가능한 Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 | 관리 작업용 키. 클라이언트에 절대 노출 금지 |

Vercel에도 같은 변수를 Preview와 Production 환경에 각각 등록합니다. `SUPABASE_SERVICE_ROLE_KEY`는 실제로 서버 관리 작업이 생길 때만 등록하세요.

## 구조

```text
app/                  라우트와 화면
components/ui/        shadcn/ui 컴포넌트
lib/supabase/         브라우저·서버·세션 갱신 클라이언트
docs/                 제품 및 구현 문서
supabase/migrations/  SQL 마이그레이션
```

세부 설계와 다음 작업은 [docs](./docs)에 있습니다.
