import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {MatCardModule} from '@angular/material/card';
import { MatButton } from '@angular/material/button';




@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [NavbarComponent, MatSidenavModule, SidebarComponent, MatCardModule, MatButton],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
}
