/**
 * Odoo Accounting capability plugin (kind `tool`, spec 2042 §5.10, ADR-0014).
 *
 * The toolkit (`query_graph` + `odoo_execute`, scope `accounting`) is
 * assembled once in @omadia/integration-odoo and published as the
 * `odoo.agentToolkit.accounting` service. This plugin registers each of its
 * tools via `ctx.tools.register` (`registerTools.ts`) under an
 * instance-unique name and returns `{ close }`. It has no persona, no system
 * prompt and no sub-agent: the former persona ships as agent templates in
 * manifest.yaml, the tool knowledge is in the tool descriptions
 * (`toolDocs.ts`).
 *
 * Requires @omadia/integration-odoo >= 0.2.0 (publishes odoo.agentToolkit.*).
 */

import type { LocalSubAgentTool, PluginContext } from '@omadia/plugin-api';

import { registerToolkitTools } from './registerTools.js';
import { ACCOUNTING_TOOL_DOCS, ACCOUNTING_TOOL_RENAME } from './toolDocs.js';

const AGENT_TOOLKIT_SERVICE = 'odoo.agentToolkit.accounting';

/** Structural shim for the service value published by integration-odoo. */
interface OdooAgentToolkit {
  readonly tools: LocalSubAgentTool[];
}

export interface AccountingHandle {
  close(): Promise<void>;
}

export async function activate(ctx: PluginContext): Promise<AccountingHandle> {
  ctx.log('activating odoo-accounting tools');

  const toolkit = ctx.services.get<OdooAgentToolkit>(AGENT_TOOLKIT_SERVICE);
  if (!toolkit) {
    throw new Error(
      `agent-odoo-accounting: required service '${AGENT_TOOLKIT_SERVICE}' not published — @omadia/integration-odoo (>= 0.2.0) must be active before this agent (declared in depends_on).`,
    );
  }

  // Every toolkit tool goes to the kernel's tool runtime.
  const disposeTools = registerToolkitTools(ctx, toolkit.tools, {
    rename: ACCOUNTING_TOOL_RENAME,
    docs: ACCOUNTING_TOOL_DOCS,
  });

  ctx.log(
    `odoo-accounting ready (tools=${String(toolkit.tools.length)}: ${toolkit.tools
      .map((t) => t.spec.name)
      .join(', ')})`,
  );

  return {
    async close() {
      ctx.log('deactivating odoo-accounting tools');
      disposeTools();
    },
  };
}
