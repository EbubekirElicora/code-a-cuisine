import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Recipe } from '../../core/recipes/recipe.types';
import {
  RecipeFlowService,
  Cuisine,
  CookingTime,
} from '../../services/recipe-flow.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './results.component.html',
  styleUrls: [
    './results.component.scss',
    './results-responsive-component.scss',
  ],
})
export class ResultsComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(
    private flow: RecipeFlowService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.recipes = this.flow.lastResults;
    if (!this.recipes || this.recipes.length === 0) {
      this.router.navigate(['/preferences']);
    }
  }

  trackById(_: number, r: Recipe) {
    return r.id;
  }

  get primaryCuisine(): Cuisine | null {
    return this.flow.preferences.cuisine ?? null;
  }

  get primaryCookingTime(): CookingTime | null {
    return this.flow.preferences.cookingTime;
  }
}
