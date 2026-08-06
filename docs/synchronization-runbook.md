# Synchronization runbook

## Required environment

Set `MILITARY_KEY` only in `.env.local` (or a secure CI secret). Never commit or paste it into source code. The sync is a server-side CLI task; normal visitor traffic never runs it.

## Commands

```powershell
npm.cmd run validate:data
npm.cmd run sync:specialties -- --dry-run
npm.cmd run sync:specialties
```

The dry run validates, normalizes, de-duplicates, matches, and prints a result without replacing active files. A normal run stores raw records locally, creates a dated immutable snapshot, updates the active snapshot, writes unmatched-record review data, and refreshes the bundled master.

## Failure recovery

- A timeout, API authentication error, malformed response, or zero-record response leaves the current dataset unchanged.
- Inspect the printed `errorCode` and do not delete the previous generated master.
- A stale `.sync-lock` older than 15 minutes is automatically cleared. Otherwise wait for the running sync to finish.
- File-backed snapshots are for local development/build preparation. For live runtime synchronization, configure a persistent server-side store before enabling a production scheduler.
