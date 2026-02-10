import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  RecipeFlowService,
  CookingTime,
  Cuisine,
  DietPreference,
} from '../../services/recipe-flow.service';
import { RecipeService } from '../../services/recipe.service';
import { GenerateRecipesPayload } from '../../core/recipes/recipe.types';

type ErrorType = 'quota' | 'ingredients' | 'generic' | null;

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './preferences.component.html',
  styleUrls: [
    './preferences.component.scss',
    './preferences-responsive.component.scss',
  ],
})
export class PreferencesComponent {
  loading = false;
  error = '';
  errorType: ErrorType = null;

  constructor(
    public flow: RecipeFlowService,
    private api: RecipeService,
    private router: Router,
  ) {}

  changeServings(delta: number) {
    const next = this.flow.servings + delta;
    this.flow.servings = Math.min(12, Math.max(1, next));
  }

  changeHelpers(delta: number) {
    const next = this.flow.helpersCount + delta;
    const clamped = Math.min(3, Math.max(1, next)) as 1 | 2 | 3;
    this.flow.helpersCount = clamped;
  }

  setCookingTime(value: CookingTime) {
    this.flow.preferences.cookingTime = value;
  }

  setCuisine(value: Cuisine) {
    this.flow.preferences.cuisine =
      this.flow.preferences.cuisine === value ? null : value;
  }

  isCuisineSelected(value: Cuisine): boolean {
    return this.flow.preferences.cuisine === value;
  }

  setDiet(value: DietPreference) {
    this.flow.preferences.diet =
      this.flow.preferences.diet === value ? null : value;
  }

  isDietSelected(value: DietPreference): boolean {
    return this.flow.preferences.diet === value;
  }

  generate() {
    if (this.loading) return;
    this.startLoading();
    this.subscribeToRecipeGeneration();
  }

  private subscribeToRecipeGeneration(): void {
    this.api.generateRecipes$(this.buildPayload()).subscribe({
      next: (recipes) => this.onGenerateSuccess(recipes),
      error: (err) => this.onGenerateError(err),
    });
  }

  closeError() {
    this.errorType = null;
    this.error = '';
  }

  backToIngredients() {
    this.closeError();
    this.router.navigate(['/generate']);
  }

  private startLoading() {
    this.loading = true;
    this.closeError();
  }

  private stopLoading() {
    this.loading = false;
  }

  private buildPayload(): GenerateRecipesPayload {
    return {
      ingredients: this.flow.ingredients,
      servings: this.flow.servings,
      preferences: this.flow.buildApiPreferences(),
      helpers: { count: this.flow.helpersCount },
    };
  }

  private onGenerateSuccess(recipes: any[]) {
    this.stopLoading();
    /*     if (!recipes || recipes.length === 0) return this.setIngredientsError();
     */
    if (!recipes || recipes.length === 0) return this.setGenericError();
    this.flow.setLastResults(recipes.slice(0, 3));
    this.router.navigate(['/results']);
  }

  private onGenerateError(err: any) {
    this.stopLoading();
    console.error('[GenerateRecipes] API error', {
      status: err?.status,
      body: err?.error,
      message: err?.error?.message,
    });
    if (err?.status === 429) return this.setQuotaError();
    if (err?.status === 400 || err?.status === 422)
      return this.setIngredientsError();
    this.setGenericError();
  }

  private setQuotaError() {
    this.errorType = 'quota';
    this.error =
      'Quota reached: You have used all recipe generations for today. Please try again tomorrow.';
  }

  private setIngredientsError() {
    this.errorType = 'ingredients';
    this.error =
      'It looks like some ingredient quantities aren’t sufficient for your selected servings. Please add or adjust quantities and try again.';
  }

  private setGenericError() {
    this.errorType = 'generic';
    this.error =
      'Something went wrong while generating your recipes. Please try again in a moment.';
  }
}
