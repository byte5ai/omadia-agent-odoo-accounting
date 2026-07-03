<div align="center">

# @omadia/agent-odoo-accounting

### Read-only Odoo Accounting sub-agent for omadia — invoices, payments, open items, journals, chart of accounts.

An **Odoo Accounting** agent plugin for [omadia](https://github.com/byte5ai/omadia),
built on [`@omadia/integration-odoo`](https://github.com/byte5ai/omadia-integration-odoo).

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/built%20with-TypeScript-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## How it works

A sub-agent playbook (`skills/playbook.md` + `skills/runtime-note.md`) plus a
thin plugin entry point (`src/plugin.ts`) that wraps the shared Odoo
integration's read-only accounting surface — invoices (in/out), payments,
open items, journals, chart of accounts — and a graph-lookup tool from
[`@omadia/verifier`](https://github.com/byte5ai) for cross-checking.

## Build, typecheck

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run build        # tsc
```

`@omadia/plugin-api` and `@omadia/orchestrator` are **peer dependencies**,
provided by the omadia host at runtime. `@omadia/verifier` is additionally
linked as a `file:` devDependency (it's imported at the value level, not just
typed) so local typechecking and builds are green standalone — see `paths` in
`tsconfig.json`, which assumes a sibling `odoo-bot` checkout.

## Manifest

See [`manifest.yaml`](manifest.yaml) for the full plugin manifest.

## License

MIT © byte5 GmbH — see [LICENSE](LICENSE).
