  import { Component } from '@angular/core';
  import { NavbarComponent } from '../navbar/navbar.component';
  import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';

  @Component({
    selector: 'app-admin',
    standalone: true,
    imports: [ NavbarComponent, RouterOutlet, SidebarComponent, MatDrawer,MatDrawerContainer],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.css'
  })
  export class AdminComponent {

  }
