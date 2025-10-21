mport { Component, Input } from '@angular/core';
@Component({ selector: 'app-nutrition-summary', templateUrl: './nutrition-summary.component.html' })
export class NutritionSummaryComponent {
@Input() nutrition: any;
}