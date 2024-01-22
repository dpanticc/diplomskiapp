import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';


export interface PeriodicElement {
  username: string;
  position: number;
  email: number;
  firstName: string;
  lastName: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, username: 'Hydrogen', email: 1.0079, firstName: 'H', lastName: 'Woof'},
  {position: 2, username: 'Helium', email: 4.0026, firstName: 'He', lastName: 'Hejhe'},
 
];

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NavbarComponent, MatSidenavModule, SidebarComponent, MatTableModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  dataSource = ELEMENT_DATA;
  displayedColumns: string[] = ['position', 'username', 'email', 'firstName', 'lastName'];

}
