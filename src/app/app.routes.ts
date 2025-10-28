import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/landing/landing.component')
      .then(m => m.LandingComponent),
    title: 'MealMate - Planifica tus comidas'
  },
  
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent),
    title: 'Iniciar Sesión - MealMate'
  },
  
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component')
      .then(m => m.RegisterComponent),
    title: 'Registrarse - MealMate'
  },
  
  {
    path: 'recipes',
    loadComponent: () => import('./features/public/recipes-list/recipes-list.component')
      .then(m => m.RecipesListComponent),
    title: 'Recetas Públicas - MealMate'
  },
  
  {
    path: 'recipes/:id',
    loadComponent: () => import('./features/public/recipe-detail/recipe-detail.component')
      .then(m => m.RecipeDetailComponent),
    title: 'Detalle de Receta - MealMate'
  },
    {
  path: 'user/:username',
  loadComponent: () => import('./features/public/user-profile-public/user-profile-public.component')
    .then(m => m.UserProfilePublicComponent),
  title: 'Perfil de Usuario - MealMate'
},

  {
    path: 'dashboard',
    loadComponent: () => import('./features/private/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard - MealMate'
  },
  
  // RUTA DE EDITAR PERFIL (privada, solo para usuario autenticado)
  {
    path: 'profile',
    loadComponent: () => import('./features/private/profile/profile.component')
      .then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'Mi Perfil - MealMate'
  },
  
  {
    path: 'recipes/my',
    loadComponent: () => import('./features/private/my-recipes/my-recipes.component')
      .then(m => m.MyRecipesComponent),
    canActivate: [authGuard],
    title: 'Mis Recetas - MealMate'
  },
  
  {
    path: 'recipes/new',
    loadComponent: () => import('./features/private/recipe-form/recipe-form.component')
      .then(m => m.RecipeFormComponent),
    canActivate: [authGuard],
    title: 'Nueva Receta - MealMate'
  },
  
  {
    path: 'recipes/edit/:id',
    loadComponent: () => import('./features/private/recipe-form/recipe-form.component')
      .then(m => m.RecipeFormComponent),
    canActivate: [authGuard],
    title: 'Editar Receta - MealMate'
  },
  
  {
    path: 'recipes/saved',
    loadComponent: () => import('./features/private/saved-recipes/saved-recipes.component')
      .then(m => m.SavedRecipesComponent),
    canActivate: [authGuard],
    title: 'Recetas Guardadas - MealMate'
  },
  
  {
    path: 'recipes/friends',
    loadComponent: () => import('./features/private/friends-recipes/friends-recipes.component')
      .then(m => m.FriendsRecipesComponent),
    canActivate: [authGuard],
    title: 'Recetas de Amigos - MealMate'
  },
  
  {
    path: 'planner',
    loadComponent: () => import('./features/private/planner/planner.component')
      .then(m => m.PlannerComponent),
    canActivate: [authGuard],
    title: 'Planificador - MealMate'
  },
  
  {
    path: 'shopping-list',
    loadComponent: () => import('./features/private/shopping-list/shopping-list.component')
      .then(m => m.ShoppingListComponent),
    canActivate: [authGuard],
    title: 'Lista de Compra - MealMate'
  },
  
  {
    path: 'groups',
    loadComponent: () => import('./features/private/groups/groups.component')
      .then(m => m.GroupsComponent),
    canActivate: [authGuard],
    title: 'Mis Grupos - MealMate'
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];