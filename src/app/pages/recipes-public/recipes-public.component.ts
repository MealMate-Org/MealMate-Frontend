import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
@Component({ selector: 'app-recipes-public', templateUrl: './recipes-public.component.html' })
export class RecipesPublicComponent implements OnInit {
  recipes: any[] = [];
  searchTerm = '';
  constructor(private recipeService: RecipeService) {}
  ngOnInit() {
    this.recipeService.getAllRecipes().subscribe((recipes) => (this.recipes = recipes));
  }
  get filteredRecipes() {
    return this.recipes.filter((r) =>
      r.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
