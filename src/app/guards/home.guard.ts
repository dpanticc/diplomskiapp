// role.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (!this.loginService.isAuthenticated() ) {
      return true; // Allow access for non-authenticated users
    } else {
        if(!this.loginService.isAdmin()){   
   
            this.router.navigate(['/home']);
            return false;
        }else{
            console.log(this.loginService.isAdmin())
            this.router.navigate(['/admin-home']);
            return false;
        }
    }
  }
}

