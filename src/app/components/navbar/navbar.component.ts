import { Component, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { LogoutService } from 'src/app/services/user/logout.service';
import { Router, RouterModule } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, HttpClientModule,  RouterOutlet, MatToolbarModule, RouterModule, DialogComponent, SidebarComponent, MatSidenavModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [LogoutService],

})
export class NavbarComponent {

  @ViewChild('drawer') drawer: MatDrawer | undefined;
  
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
            localStorage.clear();
            this.router.navigate(['/']);
            console.log(error);
          }
        );
      }
      

    });
  }
 

}
