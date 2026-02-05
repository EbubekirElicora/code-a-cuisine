import { MissingBasic } from './recipe.types.js';

export function normalizeMissingBasics(mb: unknown): MissingBasic[] {
  if (!Array.isArray(mb)) return [];
  return mb
    .map((x: any) => (typeof x === 'string' ? { name: x } : toMissingBasic(x)))
    .filter((x: any) => x.name);
}

function toMissingBasic(x: any): MissingBasic {
  return {
    name: pickName(x),
    amount: x.amount != null ? Number(x.amount) : undefined,
    unit: x.unit != null ? String(x.unit) : undefined,
    raw: typeof x.raw === 'string' ? x.raw : undefined,
  };
}

function pickName(x: any): string {
  return String(x.name ?? '').trim()
    || String(x.raw ?? '').trim()
    || 'Unknown';
}