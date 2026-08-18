/**
 * Odoo Accounting Sub-Agent — thin consumer.
 *
 * Phase 6: the LocalSubAgent toolkit (`query_graph` + `odoo_execute`) is now
 * assembled once in @omadia/integration-odoo and published as the
 * `odoo.agentToolkit.accounting` service. This plugin just consumes it — the
 * previous graph-lookup wiring (and the @omadia/verifier dependency it needed)
 * moved into the integration, collapsing the boilerplate that this package and
 * @omadia/agent-odoo-hr used to duplicate.
 *
 * The runtime systemPrompt still comes from this package's manifest `skills`
 * (loadSystemPrompt concatenates `runtime-note.md` + `playbook.md`); the
 * dynamic-runtime wraps the returned toolkit into a LocalSubAgent + DomainTool.
 *
 * Requires @omadia/integration-odoo >= 0.2.0 (publishes odoo.agentToolkit.*).
 */

import type { PluginContext } from '@omadia/plugin-api';
import type { LocalSubAgentTool } from '@omadia/plugin-api';

const AGENT_TOOLKIT_SERVICE = 'odoo.agentToolkit.accounting';

/** Structural shim for the service value published by integration-odoo. */
interface OdooAgentToolkit {
  readonly tools: LocalSubAgentTool[];
}

export interface AccountingHandle {
  readonly toolkit: { tools: LocalSubAgentTool[] };
  close(): Promise<void>;
}

export async function activate(ctx: PluginContext): Promise<AccountingHandle> {
  ctx.log('activating odoo-accounting agent');

  const toolkit = ctx.services.get<OdooAgentToolkit>(AGENT_TOOLKIT_SERVICE);
  if (!toolkit) {
    throw new Error(
      `agent-odoo-accounting: required service '${AGENT_TOOLKIT_SERVICE}' not published — @omadia/integration-odoo (>= 0.2.0) must be active before this agent (declared in depends_on).`,
    );
  }

  ctx.log(
    `odoo-accounting ready (tools=${String(toolkit.tools.length)}: ${toolkit.tools
      .map((t) => t.spec.name)
      .join(', ')})`,
  );

  return {
    toolkit: { tools: toolkit.tools },
    async close() {
      ctx.log('deactivating odoo-accounting agent');
    },
  };
}
