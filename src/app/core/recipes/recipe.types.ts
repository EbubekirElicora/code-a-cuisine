import { CookingTime } from '../../services/recipe-flow.service';

export type HelperTodo = { helper: number; tasks: string[] };

export type MissingBasic = {
  name: string;
  amount?: number;
  unit?: string;
  raw?: string;
};

export type Recipe = {
  id: string;
  title: string;
  ingredientsUsed: string[];
  servings: number;
  createdAt: string;
  cookingTime: string;
  tags: string[];
  likes: number;
  missingBasics: MissingBasic[];
  steps: string[];
  stepTitles?: string[];
  stepBodies?: string[];
  energyKcal?: number | null;
  proteinG?: number | null;
  fatG?: number | null;
  carbsG?: number | null;
  helperTodos: HelperTodo[];
  cuisine?: string | null;
  diet?: string | null;
  timeCategory?: CookingTime | string | null;
  helpersCount?: number | null;
};

export type CreateRecipePayload = { ingredients: string[]; servings: number };

export type GenerateRecipesPayload = {
  ingredients: string[];
  servings: number;
  preferences: {
    cookingTime: CookingTime | null;
    cuisine: string;
    diet: string;
  };
  helpers: { count: 1 | 2 | 3 };
};

export type ApiRecipe = {
  id: string;
  title?: string;
  ingredientsUsed?: string[];
  servings?: number;
  createdAt?: string;
  cookingTime?: string;
  timeCategory?: string;
  tags?: string[];
  likes?: number;
  missingBasics?: Array<MissingBasic | string>;
  steps?: string[];
  helperTodos?: HelperTodo[] | string;
  cuisine?: string;
  diet?: string;
  energyKcal?: number | null;
  proteinG?: number | null;
  fatG?: number | null;
  carbsG?: number | null;
  helpersCount?: number;
};

export type ApiRecipesResponse = { status: number; recipes: ApiRecipe[] };

export type GenerateRecipesResponse = {
  status?: number;
  saved?: boolean;
  recipes?: ApiRecipe[];
};

export type LikeRecipeResponse = {
  status?: number;
  saved?: boolean;
  id?: string;
  likes?: number;
};

export type CreateRecipeResponse = {
  status?: number;
  saved?: boolean;
  id?: string;
  recipe?: ApiRecipe;
};
