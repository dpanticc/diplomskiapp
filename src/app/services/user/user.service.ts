import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface PeriodicElement {
  username: string;
  position: number;
  email: number;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<PeriodicElement[]> {
    return this.http.get<PeriodicElement[]>(this.apiUrl);
  }

  deleteUser(username: string): Observable<void> {
    const deleteUserUrl = `${this.apiUrl}/${username}`;
    return this.http.delete<void>(deleteUserUrl);
  }
}
