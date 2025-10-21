import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MealMate-Frontend');
}

// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterModule, Routes } from '@angular/router';
// import { DragDropModule } from '@angular/cdk/drag-drop';

// import { AppComponent } from './app.component';
// import { LandingPageComponent } from './pages/landing-page/landing-page.component';
// import { LoginComponent } from './pages/login/login.component';
// import { RegisterComponent } from './pages/register/register.component';
// import { RecipesPublicComponent } from './pages/recipes-public/recipes-public.component';
// import { RecipeDetailPublicComponent } from './pages/recipe-detail-public/recipe-detail-public.component';
// import { UserPublicProfileComponent } from './pages/user-public-profile/user-public-profile.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { ProfileComponent } from './pages/profile/profile.component';
// import { MyRecipesComponent } from './pages/my-recipes/my-recipes.component';
// import { NewRecipeComponent } from './pages/new-recipe/new-recipe.component';
// import { SavedRecipesComponent } from './pages/saved-recipes/saved-recipes.component';
// import { FriendsRecipesComponent } from './pages/friends-recipes/friends-recipes.component';
// import { PlannerComponent } from './pages/planner/planner.component';
// import { ShoppingListComponent } from './pages/shopping-list/shopping-list.component';
// import { GroupsComponent } from './pages/groups/groups.component';

// import { AuthService } from './services/auth.service';
// import { RecipeService } from './services/recipe.service';
// import { UserService } from './services/user.service';
// import { PlannerService } from './services/planner.service';
// import { ShoppingService } from './services/shopping.service';
// import { GroupService } from './services/group.service';

// import { AuthGuard } from './guards/auth.guard';

// import { HeaderComponent } from './components/header/header.component';
// import { FooterComponent } from './components/footer/footer.component';
// import { RecipeCardComponent } from './components/recipe-card/recipe-card.component';
// import { NutritionSummaryComponent } from './components/nutrition-summary/nutrition-summary.component';

// const routes: Routes = [
//   { path: '', component: LandingPageComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'recipes', component: RecipesPublicComponent },
//   { path: 'recipes/:id', component: RecipeDetailPublicComponent },
//   { path: 'users/:username', component: UserPublicProfileComponent },
//   { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
//   { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
//   { path: 'recipes/my', component: MyRecipesComponent, canActivate: [AuthGuard] },
//   { path: 'recipes/new', component: NewRecipeComponent, canActivate: [AuthGuard] },
//   { path: 'recipes/edit/:id', component: NewRecipeComponent, canActivate: [AuthGuard] },
//   { path: 'recipes/saved', component: SavedRecipesComponent, canActivate: [AuthGuard] },
//   { path: 'recipes/friends', component: FriendsRecipesComponent, canActivate: [AuthGuard] },
//   { path: 'planner', component: PlannerComponent, canActivate: [AuthGuard] },
//   { path: 'shopping-list', component: ShoppingListComponent, canActivate: [AuthGuard] },
//   { path: 'groups', component: GroupsComponent, canActivate: [AuthGuard] },
//   { path: '**', redirectTo: '', pathMatch: 'full' }
// ];

// @NgModule({
//   declarations: [
//     AppComponent,
//     LandingPageComponent,
//     LoginComponent,
//     RegisterComponent,
//     RecipesPublicComponent,
//     RecipeDetailPublicComponent,
//     UserPublicProfileComponent,
//     DashboardComponent,
//     ProfileComponent,
//     MyRecipesComponent,
//     NewRecipeComponent,
//     SavedRecipesComponent,
//     FriendsRecipesComponent,
//     PlannerComponent,
//     ShoppingListComponent,
//     GroupsComponent,
//     HeaderComponent,
//     FooterComponent,
//     RecipeCardComponent,
//     NutritionSummaryComponent
//   ],
//   imports: [
//     BrowserModule,
//     HttpClientModule,
//     FormsModule,
//     ReactiveFormsModule,
//     RouterModule.forRoot(routes),
//     DragDropModule
//   ],
//   providers: [AuthService, RecipeService, UserService, PlannerService, ShoppingService, GroupService, AuthGuard],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }