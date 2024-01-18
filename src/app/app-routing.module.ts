import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';
import { RoleGuard } from './guards//role.guard.';
import { UserGuard } from './guards//user.guard';

export const routes: Routes = [


  {path: '', component: LoginComponent, canActivate:[HomeGuard]},
  {path: 'home', component: HomeComponent, canActivate:[AuthGuard, UserGuard]},
  {path: 'admin-home', component: AdminComponent, canActivate:[AuthGuard, RoleGuard]}  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
