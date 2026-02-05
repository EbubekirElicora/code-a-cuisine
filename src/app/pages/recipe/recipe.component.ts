import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../core/recipes/recipe.types';
import { RecipeFlowService } from '../../services/recipe-flow.service';
import { computeNutritionForServings } from '../../core/recipes/nutrition.util';
import { makeFavStore } from '../../core/recipes/favorites.util';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss', './recipe-responsive.component.scss'],
})
export class RecipeComponent {
  recipe?: Recipe;
  from: 'results' | 'cookbook' = 'results';
  likedByUser = false;
  isFavorite = false;
  showIngredients = false;
  showDirections = false;

  private favStore = makeFavStore(localStorage);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private flow: RecipeFlowService,
  ) {
    this.from = readFrom(this.route);
    const id = readId(this.route);
    if (!isValidId(id)) {
      this.navigateBack();
      return;
    }
    this.isFavorite = this.favStore.read(id);
    this.loadRecipe(id);
  }

  get effectiveServings(): number {
    return clampServings(this.from, this.flow, this.recipe);
  }

  get nutritionForSelected() {
    return computeNutritionForServings(this.recipe, this.effectiveServings);
  }

  get backLink(): string {
    return this.from === 'cookbook' ? '/cookbook' : '/results';
  }

  get backLabel(): string {
    return this.from === 'cookbook' ? 'Cookbook' : 'Recipe results';
  }

  get helpersCount(): number {
    return Math.max(1, Math.min(3, this.recipe?.helpersCount ?? 1));
  }

  get chefsArray(): number[] {
    return Array.from({ length: this.helpersCount }, (_, i) => i + 1);
  }

  get visibleTags(): string[] {
    return this.recipe?.tags ?? [];
  }

  toggleIngredients(): void {
    this.showIngredients = !this.showIngredients;
  }
  toggleDirections(): void {
    this.showDirections = !this.showDirections;
  }

  getStepTitle(i: number, fallback: string): string {
    return this.recipe?.stepTitles?.[i]?.trim() || fallback;
  }

  getStepBody(i: number): string {
    return this.recipe?.stepBodies?.[i]?.trim() ?? '';
  }

  stepHelperIndex(stepIndex: number): number {
    return ((stepIndex % this.helpersCount) + 1) as number;
  }

  chefIcon(helper: number): string {
    return chefIcon(helper);
  }

  chefBgClass(helper: number): string {
    return `chef-bg-${helper}`;
  }

  trackByIndex(index: number): number {
    return index;
  }

  like() {
    const id = this.recipe?.id;
    if (!isValidId(id)) return;
    this.recipeService.likeRecipe$(id).subscribe({
      next: (res) => this.applyLikes(res?.likes),
      error: (err) => console.error('LIKE: API error ->', err),
    });
  }

  toggleFavorite() {
    const id = this.recipe?.id;
    if (!isValidId(id)) return;
    this.isFavorite = !this.isFavorite;
    this.favStore.write(id, this.isFavorite);
  }

  private loadRecipe(id: string) {
    if (this.from === 'results') {
      const match = this.flow.lastResults.find((r) => r.id === id);
      if (match) {
        this.loadFromResults(match, id);
        return;
      }
    }
    this.loadFromApi(id);
  }

  private loadFromResults(match: Recipe, id: string) {
    const ingredientsUsed = pickIngredients(match, this.flow.ingredients);
    this.recipe = { ...match, ingredientsUsed };
    this.refreshIfHasNutrition(id, ingredientsUsed);
  }

  private refreshIfHasNutrition(id: string, ingredientsUsed: string[]) {
    this.recipeService.getRecipeById$(id).subscribe((fresh) => {
      if (!fresh) return;
      if (!hasNutrition(fresh)) return;
      this.recipe = { ...fresh, ingredientsUsed };
    });
  }

  private loadFromApi(id: string) {
    this.recipeService.getRecipeById$(id).subscribe((r) => {
      this.recipe = r;
      if (!r) this.navigateBack();
    });
  }

  private applyLikes(likes?: number) {
    const current = this.recipe?.likes ?? 0;
    const newLikes = typeof likes === 'number' ? likes : current + 1;
    if (this.recipe) this.recipe.likes = newLikes;
  }

  private navigateBack(): void {
    this.router.navigate([this.backLink]);
  }
}

function readFrom(route: ActivatedRoute): 'results' | 'cookbook' {
  return route.snapshot.queryParamMap.get('from') === 'cookbook'
    ? 'cookbook'
    : 'results';
}

function readId(route: ActivatedRoute): string | null {
  return route.snapshot.paramMap.get('id');
}

function isValidId(id: unknown): id is string {
  return typeof id === 'string' && id !== '' && id !== 'undefined';
}

function clampServings(
  from: 'results' | 'cookbook',
  flow: RecipeFlowService,
  recipe?: Recipe,
): number {
  const n = from === 'results' ? (flow.servings ?? 1) : (recipe?.servings ?? 1);
  return Math.max(1, Math.floor(Number(n)));
}

function pickIngredients(match: Recipe, fallback: string[]): string[] {
  return match.ingredientsUsed?.length ? match.ingredientsUsed : fallback;
}

function hasNutrition(r: Recipe): boolean {
  return (
    r.energyKcal != null &&
    r.proteinG != null &&
    r.fatG != null &&
    r.carbsG != null
  );
}

function chefIcon(helper: number): string {
  if (helper === 2) return 'assets/img/icons/chef2.svg';
  if (helper === 3) return 'assets/img/icons/chef3.svg';
  return 'assets/img/icons/chef.svg';
}
