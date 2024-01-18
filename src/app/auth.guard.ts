import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('State URL:', state.url);
    console.log('Is Authenticated:', this.loginService.isAuthenticated());
    console.log('Is Admin:', this.loginService.isAdmin());
    
    if (this.loginService.isAuthenticated()) {
      console.log("truetue");
      return true;
    } else {
      console.log("falsefase");
      this.router.navigate(['/']);
      return false; 
    }
  }
}