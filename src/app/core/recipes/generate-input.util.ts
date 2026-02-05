export type IngredientUnit = 'piece' | 'ml' | 'gram';

export type IngredientEntry = {
  name: string;
  amount: number;
  unit: IngredientUnit;
};

export function validateGenerateInput(
  ingredients: IngredientEntry[],
  servings: number,
): string {
  if (ingredients.length === 0) return 'Bitte mindestens 1 Zutat hinzufügen.';
  if (servings < 1 || servings > 12)
    return 'Servings muss zwischen 1 und 12 sein.';
  return '';
}

export function formatIngredientsForApi(
  ingredients: IngredientEntry[],
): string[] {
  return ingredients.map(
    (ing) => `${ing.amount} ${unitLabel(ing.unit)} ${ing.name}`,
  );
}

function unitLabel(unit: IngredientUnit): string {
  if (unit === 'gram') return 'g';
  if (unit === 'ml') return 'ml';
  return 'x';
}
