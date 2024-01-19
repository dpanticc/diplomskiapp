import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard{
  constructor(private loginService: LoginService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    
    if (this.loginService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false; 
    }
  }
}