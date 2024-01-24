import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { LoginService } from 'src/app/services/user/login.service';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';




@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatSidenavModule, MatTabsModule, MatButtonModule, CommonModule, MatListModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  ngOnInit() {
    // Set the initial active link based on user role
    this.activeLink = this.getLinks()[0];
  }

  adminLinks = [
    { label: 'Users', icon: 'people' },
    { label: 'Rooms', icon: 'meeting_room' },
    { label: 'Reservations', icon: 'event' }
  ];

  regularUserLinks = [
    { label: 'Reservations', icon: 'event' },
    { label: 'Account', icon: 'account_circle' }
  ];
  activeLink: string | undefined;
  background: ThemePalette = undefined;
  
  constructor(private loginService: LoginService, private router: Router) {}

  getLinks(): any[] {
    return this.loginService.isAdmin() ? this.adminLinks : this.regularUserLinks;
  }

  setActiveLink(link: string): void {
    this.activeLink = link;
  }

  isActiveLink(link: string): boolean {
    return this.activeLink === link;
  }

  navigateTo(link: string): void {
    // Determine the base URL based on the user role
    const baseUrl = this.loginService.isAdmin() ? '/admin-home' : '/';
  
    // Navigate to the selected link
    this.router.navigate([baseUrl, link.toLowerCase()]);
  }
  getRouterLink(link: string | { label: string }): string {
    if (typeof link === 'string') {
        return link.toLowerCase();
    } else if (typeof link === 'object' && 'label' in link) {
        return link.label.toLowerCase();
    }

    return '';
}
}
