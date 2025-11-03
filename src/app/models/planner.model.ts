export interface MealPlan {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  createdAt?: string;
  isActive?: boolean;
}

export interface MealPlanCreateDTO {
  userId: number;
  startDate: string;
  endDate: string;
}

export interface MealPlanItem {
  id: number;
  mealPlanId: number;
  recipeId: number;
  mealTypeId: number;
  date: string;
}

export interface MealPlanItemCreateDTO {
  mealPlanId: number;
  recipeId: number;
  mealTypeId: number;
  date: string;
}

export interface MealType {
  id: number;
  name: string;
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

export interface ShoppingList {
  id: number;
  userId: number;
  mealPlanId?: number;
  weekStartDate?: string;
  weekEndDate?: string;
  title?: string;
  items: ShoppingItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ShoppingListCreateDTO {
  userId: number;
  mealPlanId?: number;
  weekStartDate?: string;
  weekEndDate?: string;
  title?: string;
  items: ShoppingItem[];
}
