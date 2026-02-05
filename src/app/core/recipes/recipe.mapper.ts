import { CookingTime } from '../../services/recipe-flow.service';
import { ApiRecipe, Recipe } from './recipe.types';
import { estimateTags } from './recipe-tags.util';
import { timeCategoryToDisplay } from './time-category.util';
import { parseHelperTodos } from './recipe-json.util';
import { normalizeMissingBasics } from './recipe-missing-basics.util';

export function mapApiRecipe(r: ApiRecipe): Recipe {
  const ingredients = r.ingredientsUsed ?? [];
  const helperTodos = parseHelperTodos(r.helperTodos);
  const missingBasics = normalizeMissingBasics((r as any).missingBasics ?? []);
  const timeCategory = pickTimeCategory(r);
  const tags =
    r.tags ?? estimateTags(ingredients, r.cuisine, r.diet, timeCategory as any);
  const cookingTime = pickCookingTimeText(r, timeCategory);
  return buildRecipe(
    r,
    ingredients,
    tags,
    cookingTime,
    missingBasics,
    helperTodos,
    timeCategory,
  );
}

function pickTimeCategory(r: ApiRecipe): CookingTime | string | null {
  return (r.timeCategory ?? r.cookingTime ?? null) as
    | CookingTime
    | string
    | null;
}

function pickCookingTimeText(r: ApiRecipe, timeCategory: any): string {
  if (r.cookingTime) return r.cookingTime;
  if (typeof timeCategory === 'string' && timeCategory)
    return timeCategoryToDisplay(timeCategory);
  return '';
}

function buildRecipe(
  r: ApiRecipe,
  ingredients: string[],
  tags: string[],
  cookingTime: string,
  missingBasics: any[],
  helperTodos: any[],
  timeCategory: any,
): Recipe {
  return {
    id: r.id,
    title: r.title ?? 'Generated',
    ingredientsUsed: ingredients,
    servings: r.servings ?? 2,
    createdAt: r.createdAt ?? new Date().toISOString(),
    cookingTime,
    tags,
    likes: r.likes ?? 0,
    missingBasics,
    steps: r.steps ?? [],
    stepTitles: (r as any).stepTitles ?? [],
    stepBodies: (r as any).stepBodies ?? [],
    energyKcal: (r as any).energyKcal ?? null,
    proteinG: (r as any).proteinG ?? null,
    fatG: (r as any).fatG ?? null,
    carbsG: (r as any).carbsG ?? null,
    helperTodos,
    cuisine: r.cuisine ?? null,
    diet: r.diet ?? null,
    timeCategory,
    helpersCount: r.helpersCount ?? null,
  };
}
