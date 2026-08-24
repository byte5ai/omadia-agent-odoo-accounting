# Changelog

## 0.1.4

- Declare `odoo.agentToolkit.accounting@^1` under `requires:` (omadia#839). It
  is resolved via `ctx.services.get` in activate() with an unconditional throw
  when absent, and `@omadia/integration-odoo` (>=0.2.1) now declares it under
  `provides:`, so the edge resolves and orders the provider first. This agent
  consumes only the toolkit (not `odoo.client`), so its row has a single name.
  Retires the `@omadia/agent-odoo-accounting` row in
  `STANDALONE_LEGACY_SERVICE_GRANTS_2026_08_20`.
