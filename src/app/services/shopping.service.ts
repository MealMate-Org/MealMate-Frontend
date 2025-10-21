import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
class ShoppingService {
  private apiUrl = 'http://localhost:8080/api/v1/shopping-lists';

  constructor(private http: HttpClient) { }

  getShoppingList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}