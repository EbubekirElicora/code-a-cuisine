import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RECIPE_ENDPOINTS } from '../core/recipes/recipe.endpoints';
import { getClientId } from '../core/utils/client-id.util';
import {
  Recipe,
  GenerateRecipesPayload,
  ApiRecipesResponse,
  GenerateRecipesResponse,
  LikeRecipeResponse,
  CreateRecipePayload,
  CreateRecipeResponse,
} from '../core/recipes/recipe.types';
import { mapApiRecipe } from '../core/recipes/recipe.mapper';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private http: HttpClient) {}

  likeRecipe$(id: string): Observable<LikeRecipeResponse> {
    return this.http.post<LikeRecipeResponse>(RECIPE_ENDPOINTS.like, { id });
  }

  getRecipes$(limit = 20, offset = 0): Observable<Recipe[]> {
    const url = buildRecipesUrl(limit, offset);
    return this.http.get<ApiRecipesResponse>(url).pipe(
      map((res) => (res.recipes ?? []).map(mapApiRecipe)),
      catchError(() => of([] as Recipe[])),
    );
  }

  /*   generateRecipes$(payload: GenerateRecipesPayload): Observable<Recipe[]> {
    return this.http.post<GenerateRecipesResponse>(RECIPE_ENDPOINTS.generate, payload).pipe(
      map((res) => (res.recipes ?? []).map(mapApiRecipe)),
    );
  }
 */

  generateRecipes$(payload: GenerateRecipesPayload): Observable<Recipe[]> {
    return this.http
      .post<GenerateRecipesResponse>(RECIPE_ENDPOINTS.generate, {
        ...payload,
        clientId: getClientId(),
      })
      .pipe(map((res) => (res.recipes ?? []).map(mapApiRecipe)));
  }

  getRecipeById$(id: string): Observable<Recipe | undefined> {
    return this.getRecipes$(200, 0).pipe(
      map((list) => list.find((r) => r.id === id)),
    );
  }

  createRecipe$(
    ingredients: string[],
    servings: number,
  ): Observable<Recipe | undefined> {
    const payload: CreateRecipePayload = { ingredients, servings };
    return this.http
      .post<CreateRecipeResponse>(RECIPE_ENDPOINTS.generate, payload)
      .pipe(map((res) => (res.recipe ? mapApiRecipe(res.recipe) : undefined)));
  }
}

function buildRecipesUrl(limit: number, offset: number): string {
  const l = encodeURIComponent(limit);
  const o = encodeURIComponent(offset);
  return `${RECIPE_ENDPOINTS.recipes}?limit=${l}&offset=${o}`;
}
