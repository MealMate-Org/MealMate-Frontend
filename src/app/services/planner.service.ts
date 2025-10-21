import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
class PlannerService {
  private apiUrl = 'http://localhost:8080/api/v1/planner';

  constructor(private http: HttpClient) { }

  getPlanner(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}