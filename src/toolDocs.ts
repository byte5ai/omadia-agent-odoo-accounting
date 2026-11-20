/**
 * Instance-unique tool names. The toolkit of `@omadia/integration-odoo` calls
 * its tools `query_graph` and `odoo_execute` in every scope; the HR plugin
 * registers the same two, so each scope gets its own prefix.
 */
export const ACCOUNTING_TOOL_NAMES = {
  graph: 'odoo_accounting_query_graph',
  execute: 'odoo_accounting_execute',
} as const;

export const ACCOUNTING_TOOL_RENAME: Readonly<Record<string, string>> = {
  query_graph: ACCOUNTING_TOOL_NAMES.graph,
  odoo_execute: ACCOUNTING_TOOL_NAMES.execute,
};

/**
 * Tool knowledge that used to live in the playbook and runtime-note skills
 * (prompt_partial), now appended to the tool descriptions the calling agent
 * sees (spec 2042 §5.10). Persona and tone ship as agent templates instead.
 */
export const ACCOUNTING_TOOL_DOCS: Readonly<Record<string, string>> = {
  [ACCOUNTING_TOOL_NAMES.graph]: [
    'The graph is synced from Odoo every 6 h and answers in under 10 ms: ask it FIRST for stable master data (which journals, which customers or vendors named X, which accounts, who is in department Y). The partner graph holds only active commercial partners (customer_rank > 0 or supplier_rank > 0).',
    `If it finds nothing, or the question is about numbers, status or time, use \`${ACCOUNTING_TOOL_NAMES.execute}\`.`,
  ].join('\n'),
  [ACCOUNTING_TOOL_NAMES.execute]: [
    'Use it for everything transactional: invoices (account.move, account.move.line), payments (account.payment), current balances, status fields, anything with date filters, and whenever the graph has no hit. Read-only: create, write, unlink, copy, action_*, button_*, post and any method starting with `_` are blocked server-side.',
    'Allowed models (others answer 403 `model_not_allowed`): account.move, account.move.line, account.payment, res.partner, account.account, account.journal, res.currency, account.analytic.account, account.analytic.line.',
    'account.move: name, ref, move_type (out_invoice customer invoice, out_refund customer credit note, in_invoice vendor bill, in_refund vendor credit note, entry journal entry), state (draft/posted/cancel), payment_state (not_paid/in_payment/paid/partial/reversed/invoicing_legacy), date, invoice_date, invoice_date_due, partner_id, amount_untaxed, amount_tax, amount_total, amount_residual, currency_id, journal_id, invoice_origin, invoice_payment_term_id. account.move.line: move_id, account_id, partner_id, date, date_maturity, debit, credit, balance, amount_currency, reconciled, parent_state, move_name, journal_id, analytic_distribution. account.payment: name, partner_id, amount, payment_type (inbound/outbound), partner_type (customer/supplier), state, date, journal_id, is_reconciled. res.partner: name, email, vat, city, country_id, is_company, customer_rank, supplier_rank, credit, debit, total_invoiced. account.account: code, name, account_type, reconcile, deprecated. account.journal: name, code, type (sale/purchase/cash/bank/general), default_account_id. res.currency: name, symbol, rate. account.analytic.account (cost centres): name, code, plan_id, active. account.analytic.line: account_id, move_line_id, date, amount (already weighted by analytic_distribution), partner_id, unit_amount.',
    'Recipes: open customer invoices = search_read on account.move with move_type out_invoice, state posted, payment_state in [not_paid, partial] (add partner_id for one customer), fields name, invoice_date, invoice_date_due, amount_total, amount_residual, currency_id, order invoice_date_due asc, limit 100; total open receivables = read_group on the same domain with `amount_residual:sum`; fuzzy partner = search_read on res.partner with `name ilike term`; aged receivables = search_read on account.move.line with parent_state posted, account_id.account_type asset_receivable, reconciled false, partner_id set, then bucket date_maturity yourself; revenue for a period = read_group on account.move (out_invoice, posted, invoice_date range) with `amount_untaxed:sum`, `amount_total:sum` grouped by journal_id; revenue by cost centre = read_group on account.analytic.line (`amount:sum` grouped by account_id, move_line_id.move_id.move_type out_invoice and state posted); list cost centres = search_read on account.analytic.account active, once per conversation.',
    'Analytic distribution: numeric keys inside `analytic_distribution` (e.g. {"92": 100.0}) are account.analytic.account ids. Always resolve them to names with a `read` on that model before presenting results; never show the raw id and never invent a mapping.',
    'Rules: prefer read_group over client-side aggregation for sums, counts and grouped totals; cap `limit` at 100 for search_read unless more is asked and pass a sensible `order`; for open items show `amount_residual`, not `amount_total`; show the currency and never sum across currencies; resolve relative dates ("last month", "Q1") to ISO ranges and state the range in the answer; with several companies ask which one is meant before aggregating. Cite the Odoo record name or number as the reference, do not invent URLs. Errors: 413 means narrow `fields`, `limit` or the domain; 502 carries the Odoo failure, report it verbatim and retry at most once.',
  ].join('\n'),
};
