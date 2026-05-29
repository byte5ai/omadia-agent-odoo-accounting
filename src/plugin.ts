/**
 * Odoo Accounting Sub-Agent — extracted from middleware kernel in Phase 5B
 * M3+M4 catch-up.
 *
 * Before: index.ts inline-built a LocalSubAgent with the accounting skill +
 * a custom systemPrompt header explaining the in-process tool surface, then
 * wrapped it in a `query_odoo_accounting` DomainTool. Both depended on
 * kernel-internal helpers (`buildSubAgentSystemPrompt`, `loadSkill`,
 * direct `KnowledgeGraph` access).
 *
 * After: this plugin exports `activate(ctx)` returning a toolkit. The
 * dynamic-runtime takes care of LocalSubAgent + DomainTool wrapping; the
 * runtime systemPrompt comes from the manifest's `skills` (loadSystemPrompt
 * concatenates `runtime-note.md` + `playbook.md` for us).
 *
 * Service consumption:
 *   `odoo.executeTool.accounting` — published by @omadia/integration-odoo
 *   `knowledgeGraph`              — published by @omadia/knowledge-graph-*
 */

import type { PluginContext } from '@omadia/plugin-api';
import type { LocalSubAgentTool } from '@omadia/plugin-api';
import { createGraphLookupTool } from '@omadia/verifier';

const EXECUTE_TOOL_SERVICE = 'odoo.executeTool.accounting';
const KNOWLEDGE_GRAPH_SERVICE = 'knowledgeGraph';

interface MinimalKnowledgeGraph {
  // Structural shim — the verifier's createGraphLookupTool only needs
  // a knowledge-graph instance handed back; we don't call methods on it
  // here. Typed as `unknown` to avoid a hard import on the KG package.
  readonly [k: string]: unknown;
}

export interface AccountingHandle {
  readonly toolkit: { tools: LocalSubAgentTool[] };
  close(): Promise<void>;
}

export async function activate(ctx: PluginContext): Promise<AccountingHandle> {
  ctx.log('activating odoo-accounting agent');

  const executeTool = ctx.services.get<LocalSubAgentTool>(EXECUTE_TOOL_SERVICE);
  if (!executeTool) {
    throw new Error(
      `agent-odoo-accounting: required service '${EXECUTE_TOOL_SERVICE}' not published — @omadia/integration-odoo must be active before this agent (declared in depends_on).`,
    );
  }

  const graph = ctx.services.get<MinimalKnowledgeGraph>(KNOWLEDGE_GRAPH_SERVICE);
  if (!graph) {
    throw new Error(
      `agent-odoo-accounting: required service '${KNOWLEDGE_GRAPH_SERVICE}' not published — declared in requires.knowledgeGraph@1.`,
    );
  }

  // The KnowledgeGraph type lives in the orchestrator-internal package
  // tree; consuming it nominally would force a hard import. Cast through
  // `unknown` — the createGraphLookupTool factory only forwards the
  // instance and never reaches into class-internal members.
  const graphLookup = createGraphLookupTool('accounting', {
    graph: graph as unknown as Parameters<typeof createGraphLookupTool>[1]['graph'],
  });

  ctx.log(
    `odoo-accounting ready (tools=2: ${graphLookup.spec.name}, ${executeTool.spec.name})`,
  );

  return {
    toolkit: { tools: [graphLookup, executeTool] },
    async close() {
      ctx.log('deactivating odoo-accounting agent');
    },
  };
}
