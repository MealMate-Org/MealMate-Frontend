import { Component, OnInit } from '@angular/core';
import { ShoppingService } from '../../services/shopping.service';
@Component({ selector: 'app-shopping-list', templateUrl: './shopping-list.component.html' })
export class ShoppingListComponent implements OnInit {
  items: any[] = [];
  constructor(private shoppingService: ShoppingService) {}
  ngOnInit() {
    this.shoppingService.getShoppingList().subscribe((items) => (this.items = items));
  }
}
