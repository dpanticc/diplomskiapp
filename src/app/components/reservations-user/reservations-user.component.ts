import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {  ReservationTablesComponent } from './reservation-tables/reservation-tables.component';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-reservations-user',
  standalone: true,
  imports: [CommonModule, MatStepperModule,MatCardModule, MatButtonModule, ReservationTablesComponent],
  templateUrl: './reservations-user.component.html',
  styleUrl: './reservations-user.component.css'
})
export class ReservationsUserComponent implements AfterViewInit, OnInit {

  @ViewChild(MatStepper) stepper!: MatStepper;

  ngAfterViewInit() {
    if (this.stepper) {
      this.stepper._getIndicatorType = () => 'number';
    }
  }

  ngOnInit(): void {
    // Fetch reservations data when component initializes
    this.fetchReservations();
  }
  
  activeStep: FormGroup;
  pendingStep: FormGroup;
  canceledStep: FormGroup;

  // Define arrays for active, pending, and canceled reservations
  activeReservations: any[] = [];
  pendingReservations: any[] = [];
  canceledReservations: any[] = [];

  constructor(private formBuilder: FormBuilder, private reservationService: ReservationService, private roomService: RoomService) {
    // Initialize form groups and validators
    this.activeStep = this.formBuilder.group({});
    this.pendingStep = this.formBuilder.group({});
    this.canceledStep = this.formBuilder.group({});

  }

  fetchReservations(): void {
    const username = localStorage.getItem('username');
  
    this.reservationService.getUsersReservations(username).subscribe({
      
      next: (reservations: any[]) => {
        const roomNameRequests = reservations.map(reservation => this.roomService.getRoomNamesByIds(reservation.roomIds));

        console.log('All Reservations:', reservations);
  
        this.activeReservations = reservations.filter(reservation => reservation.timeSlotDTO.status === 'RESERVED');
        console.log('Active Reservations:', this.activeReservations);
        
        this.pendingReservations = reservations.filter(reservation => reservation.timeSlotDTO.status === 'PENDING');
        console.log('Pending Reservations:', this.pendingReservations);
        
        this.canceledReservations = reservations.filter(reservation => reservation.timeSlotDTO.status === 'CANCELED');
        console.log('Canceled Reservations:', this.canceledReservations);
  
      },
      error: (error: any) => {
        console.error('Error fetching reservations:', error);
        // Handle error appropriately (e.g., show error message)
      }
    });
  }
}
