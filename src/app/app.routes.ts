import { Routes } from '@angular/router';
import { HeroComponent } from './pages/hero/hero.component';
import { GenerateComponent } from './pages/generate/generate.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';
import { ResultsComponent } from './pages/results/results.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { CookbookComponent } from './pages/cookbook/cookbook.component';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'generate', component: GenerateComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'recipe/:id', component: RecipeComponent },
  {
    path: 'cookbook',
    loadComponent: () =>
      import('./pages/cookbook/cookbook.component').then(
        (m) => m.CookbookComponent,
      ),
  },
  {
    path: 'cookbook/:cuisine',
    loadComponent: () =>
      import('./pages/cuisine-recipes-component/cuisine-recipes-component.component').then(
        (m) => m.CuisineRecipesComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];