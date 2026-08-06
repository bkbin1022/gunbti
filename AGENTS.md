# 특급꿀벌 개발 지침

## 제품과 기술

- 특급꿀벌은 성향 기반 군 직무 탐색 웹서비스다. 추천 결과는 참고용이며 배치·선발을 보장하지 않는다.
- Next.js App Router, TypeScript strict, Tailwind CSS v4, shadcn/ui, Supabase, Vercel을 사용한다.
- 사용자 화면의 문구는 한국어로 쓴다. 접근성, 모바일 레이아웃, 명확한 오류 상태를 기본으로 고려한다.

## 구현 규칙

- Server Component를 기본으로 사용하고, 상호작용이 있을 때만 `"use client"`를 추가한다.
- `@/` 경로 별칭을 사용한다. 재사용 UI는 `components/`, 도메인 로직은 `lib/`에 둔다.
- Supabase service-role 키는 서버 전용이며 `NEXT_PUBLIC_` 접두사를 붙이지 않는다.
- `.env.local` 또는 실제 키를 커밋하지 않는다. 스키마 변경은 `supabase/migrations/`에 SQL 마이그레이션으로 남긴다.
- 민감한 군 복무 정보·건강 정보는 수집하지 않는다. 데이터 수집 목적과 보관 기간을 기능 도입 전에 문서화한다.

## 검증

- 변경 후 `npm run lint`, `npm run typecheck`, `npm run build`를 실행한다.
- DB 권한(RLS)과 인증 경로는 실제 Supabase 프로젝트에서 별도로 확인한다.
