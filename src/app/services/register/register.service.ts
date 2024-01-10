import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(registerData: any){

    const registerUrl = "http://localhost:8080/api/auth/register";

    console.log(registerData);
    return this.http.post<any>(registerUrl, registerData);
  }
}
