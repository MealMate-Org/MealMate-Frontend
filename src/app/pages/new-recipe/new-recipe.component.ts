import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
@Component({ selector: 'app-new-recipe', templateUrl: './new-recipe.component.html' })
export class NewRecipeComponent implements OnInit {
  recipe = {
    title: '',
    description: '',
    instructions: '',
    imagePath: '',
    authorId: null,
    isPublic: true,
    ingredients: [],
  };
  isEdit = false;
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.recipeService.getRecipeById(Number(id)).subscribe((recipe) => (this.recipe = recipe));
    }
  }
  addIngredient() {
    this.recipe.ingredients.push({ name: '', quantity: 0, unit: '' });
  }
  removeIngredient(index: number) {
    this.recipe.ingredients.splice(index, 1);
  }
  onImageChange(event: any) {
    // Handle image upload
  }
  onSubmit() {
    if (this.isEdit) {
      this.recipeService
        .updateRecipe(this.recipe.id, this.recipe)
        .subscribe(() => this.router.navigate(['/recipes/my']));
    } else {
      this.recipeService
        .createRecipe(this.recipe)
        .subscribe(() => this.router.navigate(['/recipes/my']));
    }
  }
}
