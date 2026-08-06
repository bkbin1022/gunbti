# API integration audit — Sprint 6 baseline

Reviewed: 2026-08-06

## Current behavior

- Provider: 병무청 `MMA_OPENAPI_0004` 군사특기마스터 API.
- Entry point: `scripts/sync-military-specialties.mjs`, invoked by `npm run sync:specialties`.
- Execution: local/server-side Node.js CLI only. No client component calls the API.
- Credential: `MILITARY_KEY`, read from `.env.local` and excluded from Git.
- Output: the script paginates the API, removes repeated recruitment-round entries, then writes `data/military/generated/official-specialty-master.json`.
- Public specialty pages read that bundled JSON at build/runtime; they do not currently fetch the provider directly.

## Risks found

1. The generated file is overwritten directly; an empty or malformed provider response could replace good data.
2. There is no runtime record validation, normalization-warning log, timeout, bounded retry, lock, or data-change review.
3. The raw provider response is not retained, so field changes cannot be audited later.
4. There is no immutable snapshot history or explicit active snapshot.
5. Recruitment-round rows and editorial recommendation profiles are not formally separated by a merge boundary.
6. There is no protected HTTP sync trigger, health check, freshness policy, review queue, or correction-report path.
7. The current project has no runtime schema-validation dependency. Sprint 6 uses small `unknown`-based validators rather than trusting API objects; a schema library can be adopted later if one is added deliberately.

## Sprint 6 guardrails

- The API key remains server-only and is never returned or logged.
- A failed, empty, or invalid sync must leave the existing active data unchanged.
- Fuzzy suggestions may enter the review queue, but never update a production mapping.
- Official records contain only provider-derived fields. Recommendation traits and editorial copy stay in `data/jobs.ts`.
