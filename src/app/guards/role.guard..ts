// role.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/user/login.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (this.loginService.isAuthenticated()) {
      if (this.loginService.isAdmin()) {
        return true; // Allow access for users with admin role
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
