import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ NavbarComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  
})
export class HomeComponent implements OnInit{
  ngOnInit(): void {
    
  }
}
