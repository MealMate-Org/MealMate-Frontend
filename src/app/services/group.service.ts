import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
class GroupService {
  private apiUrl = 'http://localhost:8080/api/v1/groups';

  constructor(private http: HttpClient) { }

  getAllGroups(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}