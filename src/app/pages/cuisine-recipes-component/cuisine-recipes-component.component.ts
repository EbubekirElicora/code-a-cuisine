import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../core/recipes/recipe.types';
import {
  CUISINE_INFO,
  CuisineSlug,
  normalizeCuisineSlug,
  slugToCuisine,
} from '../../core/recipes/cuisine.util';
import { getPageNumbers } from '../../core/recipes/pagination.util';

@Component({
  selector: 'app-cuisine-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cuisine-recipes-component.component.html',
  styleUrls: [
    './cuisine-recipes-component.component.scss',
    './cuisine-recipes-responsive.component.scss',
  ],
})
export class CuisineRecipesComponent {
  loading = true;
  error = '';
  recipes: Recipe[] = [];
  cuisineLabel = '';
  cuisineEmoji = '';
  heroImageSrc = '';
  slug!: CuisineSlug;
  backLabel = 'Cookbook';

  readonly pageSize = 15;
  currentPage = 1;

  constructor(
    private api: RecipeService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe((params) =>
      this.onRouteCuisine(params.get('cuisine')),
    );
  }

  private onRouteCuisine(param: string | null) {
    this.slug = normalizeCuisineSlug(param);
    this.applyHeader(this.slug);
    this.loadRecipes();
  }

  private applyHeader(slug: CuisineSlug) {
    const info = CUISINE_INFO[slug];
    this.cuisineLabel = info.label;
    this.cuisineEmoji = info.emoji;
    this.heroImageSrc = info.headerImage;
  }

  private loadRecipes() {
    this.loading = true;
    this.api.getRecipes$().subscribe({
      next: (all) => this.applyRecipes(all),
      error: () => this.setLoadError(),
    });
  }

  private applyRecipes(all: Recipe[]) {
    const target = slugToCuisine(this.slug);
    this.recipes = filterAndSortCuisine(all, target);
    this.currentPage = 1;
    this.loading = false;
  }

  private setLoadError() {
    this.error = 'Could not load recipes.';
    this.loading = false;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.recipes.length / this.pageSize));
  }

  get paginatedRecipes(): Recipe[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.recipes.slice(start, start + this.pageSize);
  }

  get pageNumbers(): (number | '...')[] {
    return getPageNumbers(this.totalPages, this.currentPage);
  }

  goToPage(page: number) {
    if (!canGoToPage(page, this.totalPages, this.currentPage)) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageClick(p: number | '...') {
    if (p !== '...') this.goToPage(p);
  }

  trackById(_: number, r: Recipe) {
    return r.id;
  }
}

function filterAndSortCuisine(all: Recipe[], target: string): Recipe[] {
  return all
    .filter((r) => (r.cuisine ?? 'Fusion') === target)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function canGoToPage(page: number, total: number, current: number): boolean {
  if (page < 1) return false;
  if (page > total) return false;
  return page !== current;
}
