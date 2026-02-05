export const RECIPE_ENDPOINTS = {
  recipes: 'http://localhost:5678/webhook/recipes',
  generate: 'http://localhost:5678/webhook/generate-recipes',
  like: 'http://localhost:5678/webhook/like-recipe',
} as const;