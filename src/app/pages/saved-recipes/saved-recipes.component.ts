import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
@Component({ selector: 'app-saved-recipes', templateUrl: './saved-recipes.component.html' })
export class SavedRecipesComponent implements OnInit {
  recipes: any[] = [];
  constructor(private recipeService: RecipeService) {}
  ngOnInit() {
    this.recipeService.getSavedRecipes().subscribe((recipes) => (this.recipes = recipes));
  }
}
