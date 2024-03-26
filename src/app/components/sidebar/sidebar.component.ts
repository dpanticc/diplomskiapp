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
    { label: 'Users', path: 'users', icon: 'people' },
    { label: 'Rooms', path: 'rooms',  icon: 'meeting_room' },
    { label: 'Reservations', path: 'reservation-manager', icon: 'event' }
  ];
 
  regularUserLinks = [
    { label: 'New request', path: 'reservation-request',  icon: 'add_circle' },
    { label: 'My reservations', path:'reservations', icon:'event'},
    { label: 'Account', path: 'account',  icon: 'account_circle' },
    
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
    
    // Find the corresponding link object
    const selectedLink = this.adminLinks.find(item => item.label === link) || this.regularUserLinks.find(item => item.label === link);
    
    if (selectedLink) {
      // Navigate to the selected link's path
      this.router.navigate([baseUrl, selectedLink.path]);
    }
  }
  
  getRouterLink(link: string | { label: string }): string {
    if (typeof link === 'string') {
      return link.toLowerCase();
    } else if (typeof link === 'object' && 'path' in link) {
      const typedLink = link as { path: string }; // Type assertion
      return typedLink.path.toLowerCase();
    }
  
    return '';
  }
}
