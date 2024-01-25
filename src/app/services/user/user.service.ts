import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface PeriodicElement {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
 
 
  
 
  private adminUrl = 'http://localhost:8080/api/admin/users';
  private userUrl =  'http://localhost:8080/api/user'
  jwtHelper: any;
  username: string | undefined;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<PeriodicElement[]> {
    return this.http.get<PeriodicElement[]>(this.adminUrl);
  }

  deleteUser(username: string): Observable<void> {
    const deleteUserUrl = `${this.adminUrl}/${username}`;
    return this.http.delete<void>(deleteUserUrl);
  }

  getUserByUsername(username: string): Observable<PeriodicElement> {
    const getUserUrl = `${this.userUrl}/${username}`;
    return this.http.get<PeriodicElement>(getUserUrl);
  }

  saveUser(userData: any) {
    return this.http.put<any>(this.userUrl, userData);
  }
}
