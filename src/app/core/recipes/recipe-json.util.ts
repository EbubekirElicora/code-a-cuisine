import { HelperTodo } from './recipe.types.js';

export function parseHelperTodos(
  value: HelperTodo[] | string | undefined,
): HelperTodo[] {
  if (Array.isArray(value)) return value as HelperTodo[];
  if (typeof value !== 'string') return [];
  try {
    return JSON.parse(value) as HelperTodo[];
  } catch {
    return [];
  }
}
