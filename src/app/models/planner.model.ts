export interface MealPlan {
  id: number;
  userId: number;
  startDate: string; // ISO date format
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
  date: string; // ISO date format
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

export interface ShoppingList {
  id: number;
  userId: number;
  mealPlanId?: number;
  groupId?: number;
  weekStartDate?: string;
  weekEndDate?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  items: ShoppingItem[];
}

export interface ShoppingListCreateDTO {
  userId: number;
  mealPlanId?: number;
  groupId?: number;
  weekStartDate?: string;
  weekEndDate?: string;
  items: ShoppingItem[];
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  checked?: boolean;
}
