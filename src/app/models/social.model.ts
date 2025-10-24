// ============================================
// MODELOS SOCIALES
// ============================================

import { User } from './user.model';

export interface Group {
  id: number;
  name: string;
  description?: string;
  createdBy: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface GroupCreateDTO {
  name: string;
  description?: string;
  createdBy: number;
}

export interface GroupMember {
  groupId: number;
  userId: number;
  role: string;
}

export interface Follow {
  followerId: number;
  followingId: number;
  createdAt: Date;
}

// ============================================
// MODELOS DE RATINGS Y FAVORITOS
// ============================================

export interface Rating {
  recipeId: number;
  userId: number;
  score: number;
}

export interface Favorite {
  userId: number;
  recipeId: number;
  createdAt: Date;
}

// ============================================
// MODELOS DE AUTENTICACIÓN
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
