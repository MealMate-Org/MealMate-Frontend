import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recipeImage',
  standalone: true
})
export class RecipeImagePipe implements PipeTransform {
  transform(imagePath: string | null | undefined): string {
    if (!imagePath || 
        imagePath === 'default' || 
        imagePath.includes('default-recipe') ||
        imagePath.trim() === '') {
      return '/MMLogo.png';
    }
    return imagePath;
  }
}