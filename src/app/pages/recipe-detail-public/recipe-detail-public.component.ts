import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
@Component({
  selector: 'app-recipe-detail-public',
  templateUrl: './recipe-detail-public.component.html',
})
export class RecipeDetailPublicComponent implements OnInit {
  recipe: any = {};
  constructor(private route: ActivatedRoute, private recipeService: RecipeService) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipeById(Number(id)).subscribe((recipe) => (this.recipe = recipe));
  }
}
