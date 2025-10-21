import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
class DietService {
  private apiUrl = 'http://localhost:8080/api/v1/diets';

  constructor(private http: HttpClient) { }

  getAllDiets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}