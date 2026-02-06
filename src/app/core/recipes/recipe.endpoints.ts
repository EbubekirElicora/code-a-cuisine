/* export const RECIPE_ENDPOINTS = {
  recipes: 'http://localhost:5678/webhook/recipes',
  generate: 'http://localhost:5678/webhook/generate-recipes',
  like: 'http://localhost:5678/webhook/like-recipe',
} as const; */


export const API_BASE = 'https://ebubekir-elicora.app.n8n.cloud';

export const RECIPE_ENDPOINTS = {
  recipes: `${API_BASE}/webhook/recipes`,
  generate: `${API_BASE}/webhook/generate-recipes`,
  like: `${API_BASE}/webhook/like-recipe`,
};