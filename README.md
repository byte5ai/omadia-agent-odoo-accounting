<div align="center">

# @omadia/agent-odoo-accounting

### Read-only Odoo Accounting tools for omadia — invoices, payments, open items, journals, chart of accounts.

An **Odoo Accounting** capability plugin (kind `tool`) for [omadia](https://github.com/byte5ai/omadia),
built on [`@omadia/integration-odoo`](https://github.com/byte5ai/omadia-integration-odoo).

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/built%20with-TypeScript-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## How it works

A capability plugin of kind `tool` (spec 2042 §5.10): it owns no credentials
and no persona. `src/plugin.ts` takes the scope-locked accounting toolkit that
`@omadia/integration-odoo` publishes as the `odoo.agentToolkit.accounting`
service and registers each tool with `ctx.tools.register`
(`src/registerTools.ts`); the kernel offers them to the agents the operator
granted this plugin to. The knowledge that used to be the playbook skill
(allowed models and fields, query recipes, analytic distribution, answer
rules) now sits in the tool descriptions (`src/toolDocs.ts`) and in
`playbook.when_to_use`. The former persona ships as two inactive agent
templates (English and German) in `manifest.yaml`; an operator turns one into
an agent in the Agent Builder.

Tools (both `side_effects: read`):

| Tool | Was | Does |
|------|-----|------|
| `odoo_accounting_query_graph` | `query_graph` | pre-synced partners, journals, accounts, currencies, departments |
| `odoo_accounting_execute` | `odoo_execute` | read-only `execute_kw` in the accounting scope |

The old names were private to the sub-agent. As native tools they are
instance-wide and the HR plugin has the same two, so each scope has its own
prefix. Needs omadia core >= 1.75.0 (kind `tool`, `agent_templates`).

## Build, typecheck

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run build        # tsc
npm test             # node:test (compiled to .test-build/)
npm run package      # out/<id>-<version>.zip
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
