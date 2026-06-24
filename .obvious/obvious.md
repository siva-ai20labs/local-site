# .obvious/obvious.md — Autobuild Repo Contract

## Overview

This is a **GREENFIELD / EMPTY** repository. No application code exists yet.
This contract is a minimal placeholder stub installed by the Autobuild setup process.
All sections marked `TODO(confirm):` must be filled in once real application code lands.

Do **not** treat any of the placeholder values below as authoritative. Re-run the full
8-phase Autobuild setup (SCAN → LOCAL-DEV → SNAPSHOT → BIBLIOGRAPHY → SECURITY →
ASSEMBLE → VALIDATE → REPORT) once a package manifest and application code are committed.

## Sandbox Snapshot

None — no dev environment exists to snapshot.

`TODO(confirm):` Re-run the full Autobuild setup after application code is added to
capture a verified sandbox snapshot with working build, lint, and test commands.

## Local Verification Summary

No build, lint, or test commands exist yet. This section will be populated by the next
setup run once a package manifest is added.

`TODO(confirm):` install command  
`TODO(confirm):` build command  
`TODO(confirm):` lint command  
`TODO(confirm):` test command  

## Re-run Guidance

Once application code and a package manifest (e.g. `package.json`, `pyproject.toml`,
`go.mod`) have been committed to `main`, re-run the full Autobuild setup:

1. Trigger a new Autobuild setup task for `siva-ai20labs/test`.
2. The 8-phase procedure will scan the repo, verify the local dev stack, capture a
   sandbox snapshot, and overwrite this stub contract with verified content.
3. Until then, all `TODO(confirm):` markers in this directory are unverified placeholders.

