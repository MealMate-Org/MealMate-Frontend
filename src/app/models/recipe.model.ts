// ============================================
// MODELOS DE RECETAS
// ============================================

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  instructions: string;
  imagePath?: string;
  authorId: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  avgRating: number;
  ratingCount: number;
  ingredients: IngredientItem[];
  allergens: Allergen[];
  mealTypeId?: number;
}

export interface RecipeCreateDTO {
  title: string;
  description?: string;
  instructions: string;
  imagePath?: string;
  authorId: number;
  isPublic: boolean;
  ingredients: IngredientItem[];
  allergenIds: number[];
  mealTypeId?: number;
}

export interface IngredientItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface Allergen {
  id: number;
  name: string;
}

export interface NutritionInfo {
  recipeId: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portionSize: number;
}
