import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';
import { RoleGuard } from './guards//role.guard.';
import { UserGuard } from './guards//user.guard';
import { UsersComponent } from './components/users/users.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { ReservationsComponent } from './components/reservations/reservations.component';

export const routes: Routes = [


  {path: '', component: LoginComponent, canActivate:[HomeGuard]},
  {path: 'home', component: HomeComponent, canActivate:[AuthGuard, UserGuard]},
  {path: 'admin-home', component: AdminComponent, 
  children: [
    { path: 'users', component: UsersComponent },
    { path: 'rooms', component: RoomsComponent },
    { path: 'reservations', component: ReservationsComponent },
    // Add more routes as needed
  ],
  canActivate:[AuthGuard, RoleGuard]}  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
