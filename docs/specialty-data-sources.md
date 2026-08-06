# Specialty data sources and verification policy

## Official source

- 병무청 군사특기마스터 OpenAPI (`MMA_OPENAPI_0004`) provides the official specialty identity, code, branch, and recruitment classification used by this app.
- Current recruitment conditions, selection criteria, and availability are not assumed from the master alone; they must be checked in the relevant current official recruitment notice.

## Editorial source policy

Editorial explanations and recommendation profiles are written separately in `data/jobs.ts`. They are labelled as editorial and must not be presented as official eligibility or assignment guarantees.

## Freshness policy

- Fresh: official sync within 30 days
- Aging: 31–90 days, recheck recommended
- Stale: more than 90 days, recheck required
- Unknown: no recorded sync date

Never accept unverified API values as an automatic change to recommendation traits, goal fit, working-environment claims, or support eligibility.
