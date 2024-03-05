import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ReservationData } from 'src/app/models/reservation.model';
import { TimeSlotData } from 'src/app/models/time-slot.model';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { Room, RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [ MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
  providers: [ReservationService, RoomService]
})
export class ConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reservationService: ReservationService,
    private notificationService: NotificationService,
    private roomService: RoomService
  ) {
    console.log('Data in ConfirmationComponent:', data);

  }

  roomNames: string[] = [];

   ngOnInit(): void {
    // Fetch room names based on room IDs
    this.roomService.getRoomNamesByIds(this.data.reservationData.roomIds).subscribe(
      (roomNames: string[]) => {
        // Extract room names and store in roomNames array
        this.roomNames = roomNames;
      },
      (error) => {
        console.error('Error fetching room names:', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    const reservationData: ReservationData = this.data.reservationData;
    const timeSlotData: TimeSlotData = this.data.timeSlotData;
    

    this.reservationService.createReservation(reservationData, timeSlotData).subscribe(
      (response: any) => {
        // Handle successful reservation and time slot creation response
        this.notificationService.getMessage(`Your reservation request has been sent successfully!`);

        console.log('Reservation and Time Slot created successfully:', response);
        this.dialogRef.close(true);
      },
      (error: any) => {
        // Handle error
        this.notificationService.getMessage(`An error occurred while making your reservation request`);
        console.error('Error creating reservation and time slot:', error);
        this.dialogRef.close(false);
      }
    );
  }
 
}
