// ============================================
// MODELOS DE PLANIFICACIÓN
// ============================================

export interface MealPlan {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface MealPlanCreateDTO {
  userId: number;
  weekStart: Date;
}

export interface MealPlanItem {
  id: number;
  mealPlanId: number;
  recipeId: number;
  mealTypeId: number;
  date: Date;
}

export interface MealPlanItemCreateDTO {
  mealPlanId: number;
  recipeId: number;
  mealTypeId: number;
  date: Date;
}

export interface MealType {
  id: number;
  name: string;
}

// ============================================
// MODELOS DE LISTA DE COMPRA
// ============================================

export interface ShoppingList {
  id: number;
  mealPlanId?: number;
  groupId?: number;
  userId: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  items: ShoppingItem[];
}

export interface ShoppingListCreateDTO {
  mealPlanId?: number;
  groupId?: number;
  userId: number;
  items: ShoppingItem[];
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}
