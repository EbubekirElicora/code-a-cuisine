import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeFlowService } from '../../services/recipe-flow.service';
import {
  IngredientEntry,
  IngredientUnit,
  formatIngredientsForApi,
  validateGenerateInput,
} from '../../core/recipes/generate-input.util';

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './generate.component.html',
  styleUrls: [
    './generate.component.scss',
    './generate-responsive.component.scss',
  ],
})
export class GenerateComponent {
  ingredientInput = '';
  ingredients: IngredientEntry[] = [];
  amountInput = 100;
  servings = 2;
  unitInput: IngredientUnit = 'gram';
  units: IngredientUnit[] = ['piece', 'ml', 'gram'];
  unitDropdownOpen = false;
  loading = false;
  errorMsg = '';
  editingIndex: number | null = null;
  editAmount = 0;
  editUnit: IngredientUnit = 'gram';
  editUnitDropdownOpen = false;
  hoveredConfirmIndex: number | null = null;

  constructor(
    private router: Router,
    public flow: RecipeFlowService,
  ) {}

  toggleUnitDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.unitDropdownOpen = !this.unitDropdownOpen;
  }

  toggleEditUnitDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.editUnitDropdownOpen = !this.editUnitDropdownOpen;
  }

  selectEditUnit(unit: IngredientUnit, event: MouseEvent) {
    event.stopPropagation();
    this.editUnit = unit;
    this.editUnitDropdownOpen = false;
  }

  unitShort(unit: IngredientUnit): string {
    if (unit === 'gram') return 'g';
    if (unit === 'ml') return 'ml';
    return 'x';
  }

  startEdit(index: number) {
    const ing = this.ingredients[index];
    this.editingIndex = index;
    this.editAmount = ing.amount;
    this.editUnit = ing.unit;
    this.editUnitDropdownOpen = false;
  }

  confirmEdit(index: number) {
    if (this.editingIndex === null) return;
    this.ingredients[index] = {
      ...this.ingredients[index],
      amount: this.editAmount,
      unit: this.editUnit,
    };
    this.editingIndex = null;
    this.editUnitDropdownOpen = false;
  }

  selectUnit(unit: IngredientUnit, event: MouseEvent) {
    event.stopPropagation();
    this.unitInput = unit;
    this.unitDropdownOpen = false;
  }

  @HostListener('document:click')
  closeAllDropdowns() {
    this.unitDropdownOpen = false;
    this.editUnitDropdownOpen = false;
  }

  get listCardSizeClass():
    | 'list-card--small'
    | 'list-card--medium'
    | 'list-card--large' {
    const len = this.ingredients.length;
    if (len <= 3) return 'list-card--small';
    if (len <= 5) return 'list-card--medium';
    return 'list-card--large';
  }

  addIngredient() {
    const name = this.ingredientInput.trim();
    if (!name) return;
    const entry: IngredientEntry = {
      name,
      amount: this.amountInput || 0,
      unit: this.unitInput,
    };
    this.ingredients = [entry, ...this.ingredients];
    this.ingredientInput = '';
    this.amountInput = 100;
    this.unitInput = 'gram';
  }

  removeIngredient(i: number) {
    this.ingredients = this.ingredients.filter((_, idx) => idx !== i);
  }

  async submit() {
    this.errorMsg = '';
    const msg = validateGenerateInput(this.ingredients, this.servings);
    if (msg) {
      this.errorMsg = msg;
      return;
    }
    this.flow.setIngredients(formatIngredientsForApi(this.ingredients));
    this.flow.setServings(this.servings);
    this.router.navigateByUrl('/preferences');
  }
}
