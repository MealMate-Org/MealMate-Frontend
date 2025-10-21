import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
class AllergenService {
  private apiUrl = 'http://localhost:8080/api/v1/allergens';

  constructor(private http: HttpClient) { }

  getAllAllergens(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}