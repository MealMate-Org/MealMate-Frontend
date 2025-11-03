export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  roleId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreference {
  userId: number;
  dailyCaloriesGoal?: number;
  dailyCarbsGoal?: number;
  dailyProteinGoal?: number;
  dailyFatGoal?: number;
  dietId?: number;
  useAutomaticCalculation?: boolean;
  gender?: 'male' | 'female';
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'deficit' | 'maintenance' | 'surplus';
}

export interface Diet {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}
