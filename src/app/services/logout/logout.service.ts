import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private http: HttpClient) { }

  logout(logout: any){
   
  const logoutUrl = "http://localhost:8080/api/auth/logout";

    const body = {"username":logout};
    console.log(body);
     return this.http.post<any>(logoutUrl, body);
  }
}
