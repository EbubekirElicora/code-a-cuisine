import { Injectable } from '@angular/core';
import { Recipe } from '../core/recipes/recipe.types';

export type CookingTime = 'Quick' | 'Medium' | 'Complex';
export type Cuisine =
  | 'German'
  | 'Italian'
  | 'Japanese'
  | 'Indian'
  | 'Gourmet'
  | 'Fusion';
export type DietPreference = 'Vegetarian' | 'Vegan' | 'Keto' | 'None';
export interface Preferences {
  cookingTime: CookingTime | null;
  cuisine: Cuisine | null;
  diet: DietPreference | null;
}

@Injectable({ providedIn: 'root' })
export class RecipeFlowService {
  ingredients: string[] = [];
  servings = 2;
  preferences: Preferences = {
    cookingTime: 'Medium',
    cuisine: 'Fusion',
    diet: 'None',
  };
  helpersCount: 1 | 2 | 3 = 1;
  lastResults: Recipe[] = [];

  setIngredients(list: string[]) {
    this.ingredients = list;
  }

  setServings(n: number) {
    this.servings = n;
  }

  setPreferences(p: Partial<Preferences>) {
    this.preferences = { ...this.preferences, ...p };
  }

  setHelpersCount(n: 1 | 2 | 3) {
    this.helpersCount = n;
  }

  setLastResults(list: Recipe[]) {
    this.lastResults = list;
  }

  buildApiPreferences(): {
    cookingTime: CookingTime | null;
    cuisine: string;
    diet: string;
  } {
    return {
      cookingTime: this.preferences.cookingTime,
      cuisine: this.preferences.cuisine ?? 'Fusion',
      diet: this.preferences.diet ?? 'None',
    };
  }
  reset() {
    this.ingredients = [];
    this.servings = 2;
    this.preferences = {
      cookingTime: 'Medium',
      cuisine: 'Fusion',
      diet: 'None',
    };
    this.helpersCount = 1;
    this.lastResults = [];
  }
}
