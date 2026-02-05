// src/app/core/recipes/time-category.util.ts
export function timeCategoryToDisplay(timeCategory: string): string {
  switch (timeCategory) {
    case 'Quick': return 'bis 20min';
    case 'Medium': return '20–45min';
    case 'Complex': return '45+min';
    default: return timeCategory;
  }
}