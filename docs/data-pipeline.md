# Specialty data pipeline

## Layers and precedence

1. **Raw official layer**: API records are stored locally under `data/military/raw/` with provider, endpoint, fetch time, and SHA-256 payload hash. This directory is ignored by Git.
2. **Normalized official layer**: the synchronization script validates `unknown` values, canonicalizes text and branches, de-duplicates repeated recruitment-round records, and records warnings.
3. **Enriched application layer**: `data/jobs.ts` owns recommendation traits, goal fit, and editorial explanatory copy. Official synchronization never writes these fields.

An immutable dated snapshot is written before `snapshots/active.json` is updated. A failed, empty, or invalid response never updates either active data or the bundled fallback. The public app uses the bundled verified master until a successfully synchronized snapshot is deployed.

## Data changes and review

Added records are informational. Removed records and changed normalized content require manual review. Unmatched records go to `data/review/unmatched-specialties.json`; fuzzy matching is deliberately not used to merge data.

## Fallback and versioning

Fallback order is active valid snapshot, bundled official master, then limited-data UI. The visible data version uses the official synchronization date. Recommendation traits remain editorially controlled and do not change after an API sync.
