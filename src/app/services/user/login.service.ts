import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
 
  loginUrl = "http://localhost:8080/api/auth";

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
   
  const body = login;

  return this.http.post<any>(`${this.loginUrl}/login`, body);
  }

  verifyCurrentPassword(username: string, currentPassword: string): Promise<boolean> {
    const verifyPasswordUrl = `${this.loginUrl}/verify-password`;
    const payload = { username, currentPasswordEncoded: currentPassword };
    return this.http.post<boolean>(verifyPasswordUrl, payload).toPromise()
      .then(result => result || false); // Ensure a boolean result, defaulting to false if undefined
  }

  updatePassword(username: string, newPassword: string): Promise<boolean> {
    const updatePasswordUrl = `${this.loginUrl}/update-password`;
    const payload = { username, newPassword };
    console.log(payload);
    console.log(updatePasswordUrl);
    return this.http.put<boolean | undefined>(updatePasswordUrl, payload)
    .toPromise()
    .then(result => {
      // Check if the result is undefined
      if (result === undefined) {
        throw new Error('Unexpected undefined result');
      }

      return result;
    })
    .catch(error => {
      console.error('Error updating password', error);
      throw error; // Rethrow the error to be caught in the calling function
    });  }
}
