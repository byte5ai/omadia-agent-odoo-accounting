// ---------------------------------------------------------------------------
// @omadia/agent-odoo-accounting — barrel
// ---------------------------------------------------------------------------
// The dynamic-channel/agent runtime imports `dist/plugin.js` directly via
// the manifest's lifecycle.entry. This index file is the package's
// `package.json#main` for any future programmatic consumer; it mirrors
// the entry's `activate` so both shapes stay in sync.

export { activate } from './plugin.js';
export type { AccountingHandle } from './plugin.js';
