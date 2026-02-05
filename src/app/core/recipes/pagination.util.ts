export function getPageNumbers(
  total: number,
  current: number,
): (number | '...')[] {
  const result: (number | '...')[] = [];
  if (total <= 7) return range(1, total);
  const [left, right] = clampWindow(total, current);
  result.push(1);
  if (left > 2) result.push('...');
  for (let i = left; i <= right; i++) result.push(i);
  if (right < total - 1) result.push('...');
  result.push(total);
  return result;
}

function range(a: number, b: number): number[] {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

function clampWindow(total: number, current: number): [number, number] {
  let left = current - 1,
    right = current + 1;
  if (left <= 2) return [2, 4];
  if (right >= total - 1) return [total - 3, total - 1];
  return [left, right];
}
