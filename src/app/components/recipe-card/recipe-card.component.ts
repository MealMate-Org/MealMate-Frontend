import { Component, Input } from '@angular/core';
@Component({ selector: 'app-recipe-card', templateUrl: './recipe-card.component.html' })
export class RecipeCardComponent {
  @Input() recipe: any;
}
