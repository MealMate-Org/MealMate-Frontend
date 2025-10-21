import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
@Component({ selector: 'app-my-recipes', templateUrl: './my-recipes.component.html' })
export class MyRecipesComponent implements OnInit {
  recipes: any[] = [];
  constructor(private recipeService: RecipeService) {}
  ngOnInit() {
    this.recipeService.getMyRecipes().subscribe((recipes) => (this.recipes = recipes));
  }
}
