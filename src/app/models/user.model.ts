// ============================================
// MODELOS DE USUARIO
// ============================================
// Estos son los "contratos" que definen la forma de los datos
// que vendrán del backend. TypeScript usa esto para autocompletado
// y detección de errores.

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  roleId: number;
}

export interface UserCreateDTO {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  roleId: number;
}

export interface UserPreference {
  userId: number;
  dailyCaloriesGoal?: number;
  dailyCarbsGoal?: number;
  dailyProteinGoal?: number;
  dailyFatGoal?: number;
  dietId?: number;
}

export interface Diet {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}
