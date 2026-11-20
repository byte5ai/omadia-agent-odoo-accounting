# Changelog

## 0.2.0

- Capability plugin instead of a sub-agent (spec 2042 §5.10, ADR-0014,
  byte5ai/omadia#2053): `identity.kind` is now `tool` (no own credentials; it
  rides on `@omadia/integration-odoo`). The plugin id is unchanged.
- `activate` registers every tool of the `odoo.agentToolkit.accounting`
  service with `ctx.tools.register` and returns `{ close }`; it no longer
  returns a `toolkit` for a sub-agent.
- **Tool names changed**: `query_graph` is now `odoo_accounting_query_graph`
  and `odoo_execute` is now `odoo_accounting_execute`. As native tools the
  names are instance-wide, and the HR plugin has the same two names (it
  becomes `odoo_hr_*`). References to the old names inside the descriptions
  are rewritten.
- The persona is gone: the `skills/` prompt partials (`playbook`,
  `runtime-note`) are removed. Allowed models and fields, query recipes,
  analytic-distribution handling and the answer rules moved into the tool
  descriptions and `playbook.when_to_use`; the persona is now two inactive
  `agent_templates` (`accounting-assistant`, `accounting-assistant-de`).
- `capabilities[].side_effects`: `read` for both tools (the toolkit only
  allows search, search_read, read, search_count, read_group, fields_get).
- Removed `llm:` preferences and `permissions.memory`. `description` is
  `en`/`de`. The ZIP no longer carries `skills/`.
- `compat.core` is `>=1.76.0 <2.0` (kind `tool`, `agent_templates`).
- Tests: `npm test` (`test/capabilityPlugin.test.ts`), new in this repo.
- No model access and no network of its own: the plugin makes no `fetch` and
  uses no SDK; all Odoo traffic runs in the integration.
- Publish only after the S3a kernel (byte5ai/omadia#2140) runs on Fly.

## 0.1.4

- Declare `odoo.agentToolkit.accounting@^1` under `requires:` (omadia#839). It
  is resolved via `ctx.services.get` in activate() with an unconditional throw
  when absent, and `@omadia/integration-odoo` (>=0.2.1) now declares it under
  `provides:`, so the edge resolves and orders the provider first. This agent
  consumes only the toolkit (not `odoo.client`), so its row has a single name.
  Retires the `@omadia/agent-odoo-accounting` row in
  `STANDALONE_LEGACY_SERVICE_GRANTS_2026_08_20`.
