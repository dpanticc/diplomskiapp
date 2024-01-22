import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  isAdmin(): any {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const roles = decodedToken.roles;
      // Check if the user has the 'ADMIN' role
      return roles && roles.includes('ADMIN');
    }
    return false;
  }
  
 
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }


  login(login: any){
   
  const loginUrl = "http://localhost:8080/api/auth/login";
  const body = login;

  return this.http.post<any>(loginUrl, body);
  }
}
