# 데이터베이스 설계

마이그레이션은 `supabase/migrations/`에 둔다. Supabase SQL Editor에서 초기 마이그레이션을 실행한 뒤, 실제 서비스 전에는 RLS 정책을 사용자 역할과 함께 검토한다.

| 테이블 | 목적 | 주요 열 |
| --- | --- | --- |
| `profiles` | 선택적 사용자 프로필 | `id`, `nickname`, `created_at` |
| `questions` | 설문 문항 | `id`, `text`, `trait`, `position`, `is_active` |
| `answer_options` | 문항 선택지와 점수 | `id`, `question_id`, `text`, `score` |
| `military_jobs` | 직무군 카탈로그 | `id`, `name`, `branch`, `description`, `traits` |
| `test_results` | 저장한 결과 | `id`, `user_id`, `scores`, `summary`, `created_at` |
| `recommendations` | 결과별 추천 직무 | `result_id`, `military_job_id`, `score`, `reason`, `rank` |

`scores`와 `traits`는 차원별 수치를 담는 JSONB다. 질문이나 직무 정의가 바뀌어도 기존 결과를 설명할 수 있도록 결과 계산에 사용한 `algorithm_version`을 저장한다.
