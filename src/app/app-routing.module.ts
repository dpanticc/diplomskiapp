import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';
import { RoleGuard } from './guards//role.guard.';
import { UserGuard } from './guards//user.guard';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { UsersComponent } from './components/users/users.component';
import { AccountComponent } from './components/account/account.component';
import { ReservationManagerComponent } from './components/reservation-manager/reservation-manager.component';
import { ReservationsUserComponent } from './components/reservations-user/reservations-user.component';

export const routes: Routes = [


  {path: '', component: LoginComponent, canActivate:[HomeGuard]},
  {path: 'home', component: HomeComponent,  
    children: [
      { path: 'account', component: AccountComponent },
      { path: 'reservation-request', component: ReservationsComponent },
      { path: 'reservations', component: ReservationsUserComponent }
    ],
    canActivate:[AuthGuard, UserGuard]},
  {
    path: 'admin-home',
    component: AdminComponent,
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'rooms', component: RoomsComponent },
      { path: 'reservation-manager', component: ReservationManagerComponent },
    ],
    canActivate:[RoleGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
