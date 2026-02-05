import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../core/recipes/recipe.types';
import { Cuisine } from '../../services/recipe-flow.service';
import {
  CUISINE_CARDS,
  CuisineSlug,
} from '../../core/recipes/cuisine-cards.const';
import { makeFavStore } from '../../core/recipes/favorites.util';
import {
  initDragState,
  onDragStart,
  onDragMove,
  onDragEnd,
} from '../../core/recipes/drag-scroll.util';

@Component({
  selector: 'app-cookbook',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cookbook.component.html',
  styleUrls: [
    './cookbook.component.scss',
    './cookbook-responsive.component.scss',
  ],
})
export class CookbookComponent {
  recipes: Recipe[] = [];
  mostLiked: Recipe[] = [];
  loading = true;
  error = '';
  backLabel = 'Back';

  @ViewChild('mostLikedScroller')
  mostLikedScroller!: ElementRef<HTMLDivElement>;

  cuisineCards = CUISINE_CARDS;

  private favStore = makeFavStore(localStorage);
  private drag = initDragState();

  constructor(
    private api: RecipeService,
    private router: Router,
  ) {
    this.loadRecipes();
  }

  private loadRecipes() {
    this.api.getRecipes$().subscribe({
      next: (data) => this.applyRecipes(data),
      error: () => this.setLoadError(),
    });
  }

  private applyRecipes(data: Recipe[]) {
    this.recipes = sortByCreatedAtDesc(data);
    this.mostLiked = buildFavorites(this.recipes, this.favStore.read);
    this.loading = false;
  }

  private setLoadError() {
    this.error = 'Could not load recipes.';
    this.loading = false;
  }

  onDragStart(event: MouseEvent) {
    const slider = this.mostLikedScroller?.nativeElement;
    if (!slider) return;
    event.preventDefault();
    onDragStart(this.drag, slider, event.pageX);
  }

  onDragMove(event: MouseEvent) {
    const slider = this.mostLikedScroller?.nativeElement;
    if (!slider || !this.drag.isDragging) return;
    event.preventDefault();
    onDragMove(this.drag, slider, event.pageX);
  }

  onDragEnd() {
    const slider = this.mostLikedScroller?.nativeElement;
    if (!slider) return;
    onDragEnd(this.drag, slider);
  }

  trackById(_: number, r: Recipe) {
    return r.id;
  }

  recipesForCuisine(slug: CuisineSlug): Recipe[] {
    const cuisineEnum = cuisineSlugToEnum(slug);
    return this.recipes.filter((r) => (r.cuisine ?? 'Fusion') === cuisineEnum);
  }

  onCardClick(event: MouseEvent, recipe: Recipe) {
    if (this.drag.hasDragged) return void blockClick(event);
    this.router.navigate(['/recipe', recipe.id], {
      queryParams: { from: 'cookbook' },
    });
  }
}

function sortByCreatedAtDesc(data: Recipe[]): Recipe[] {
  return [...data].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
}

function buildFavorites(
  all: Recipe[],
  isFav: (id: string) => boolean,
): Recipe[] {
  return all
    .filter((r) => isFav(r.id))
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
}

function cuisineSlugToEnum(slug: CuisineSlug): Cuisine {
  const map: Record<CuisineSlug, Cuisine> = {
    italian: 'Italian',
    german: 'German',
    japanese: 'Japanese',
    gourmet: 'Gourmet',
    indian: 'Indian',
    fusion: 'Fusion',
  };
  return map[slug] ?? 'Fusion';
}

function blockClick(event: MouseEvent) {
  event.preventDefault();
  event.stopImmediatePropagation();
}
