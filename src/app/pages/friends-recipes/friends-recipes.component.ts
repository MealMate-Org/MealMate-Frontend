import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
@Component({ selector: 'app-friends-recipes', templateUrl: './friends-recipes.component.html' })
export class FriendsRecipesComponent implements OnInit {
  recipes: any[] = [];
  constructor(private recipeService: RecipeService) {}
  ngOnInit() {
    this.recipeService.getFriendsRecipes().subscribe((recipes) => (this.recipes = recipes));
  }
}
