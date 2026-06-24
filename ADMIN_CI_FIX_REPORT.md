# Admin CI Fix Report

- Failed run: `CI / admin`, run `28101479323`, job `83204358623`.
- Failed step: `npm ci` under the workflow's Node 20 environment.
- Reproduction: `npx --yes npm@10.8.2 ci` failed because `admin/package-lock.json` did not contain the nested `esbuild@0.28.1` records required by Vitest's Vite dependency.
- Exact location: the missing package record is now present at `admin/package-lock.json:4188`; the Linux x64 package used by the runner is at `admin/package-lock.json:4035`.
- Fix: regenerated/completed `admin/package-lock.json`. No backend or frontend files were changed.
- Verification: npm 10 clean install passed; production audit found 0 vulnerabilities; admin build passed; 6 test files and 11 tests passed.
