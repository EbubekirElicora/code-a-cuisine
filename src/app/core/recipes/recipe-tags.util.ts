export function estimateTags(
  ingredients: string[],
  cuisine?: string,
  diet?: string,
  timeCategory?: string | null,
): string[] {
  const tags: string[] = [];
  if (!hasMeat(ingredients)) tags.push('Vegetarian');
  pushTimeTag(tags, timeCategory, ingredients.length);
  if (diet && diet !== 'None') tags.push(diet);
  if (cuisine) tags.push(cuisine);
  return tags;
}

function hasMeat(ingredients: string[]): boolean {
  const lower = ingredients.map((i) => i.toLowerCase());
  const meats = [
    'huhn',
    'chicken',
    'rind',
    'beef',
    'schwein',
    'pork',
    'shrimp',
    'garnele',
    'lachs',
    'salmon',
  ];
  return lower.some((i) => meats.includes(i));
}

function pushTimeTag(
  tags: string[],
  timeCategory: string | null | undefined,
  n: number,
) {
  if (timeCategory) tags.push(timeCategory);
  else if (n <= 5) tags.push('Quick');
}
