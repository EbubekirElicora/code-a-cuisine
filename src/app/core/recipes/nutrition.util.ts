import { Recipe } from './recipe.types';

export function computeNutritionForServings(
  r: Recipe | undefined,
  mult: number,
) {
  if (!r) return null;
  const base = pickNutritionBase(r);
  if (!base) return null;
  return scaleNutrition(base, mult);
}

function pickNutritionBase(r: Recipe) {
  const b = {
    energyKcal: (r as any).energyKcal,
    proteinG: (r as any).proteinG,
    fatG: (r as any).fatG,
    carbsG: (r as any).carbsG,
  };
  return hasAll(b) ? b : null;
}

function hasAll(b: any): boolean {
  return (
    b.energyKcal != null &&
    b.proteinG != null &&
    b.fatG != null &&
    b.carbsG != null
  );
}

function scaleNutrition(b: any, mult: number) {
  return {
    energyKcal: Math.round(b.energyKcal * mult),
    proteinG: Math.round(b.proteinG * mult * 10) / 10,
    fatG: Math.round(b.fatG * mult * 10) / 10,
    carbsG: Math.round(b.carbsG * mult * 10) / 10,
  };
}
