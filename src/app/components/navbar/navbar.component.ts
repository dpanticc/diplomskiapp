import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { LogoutService } from 'src/app/services/logout/logout.service';
import { Router, RouterModule } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, HttpClientModule,  RouterOutlet, MatToolbarModule, RouterModule, DialogComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [LogoutService],

})
export class NavbarComponent {
  constructor(private logoutService: LogoutService, private router: Router, private dialog: MatDialog) {}

  logout() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: 'Are you sure you want to logout?',
      },
    });

    dialogRef.afterClosed().subscribe((result:boolean) => {
      if (result) {
        const username = localStorage.getItem('username');
        this.logoutService.logout(username).subscribe(
          (response) => {
            console.log(response);
            console.log('Logout successful');
            localStorage.clear();
            this.router.navigate(['/']);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }
}
