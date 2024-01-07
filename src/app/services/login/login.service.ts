import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(login: any){
   
  const loginUrl = "http://localhost:8080/api/auth/login";
  const body = login;

  return this.http.post<any>(loginUrl, body);
  }
}
