import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {MatCardModule} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { Room, RoomService } from 'src/app/services/room/room.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog
} from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [NavbarComponent, MatSidenavModule, SidebarComponent, FormComponent, MatCardModule, MatButton, CommonModule, MatFormFieldModule, FormsModule, MatInputModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css',
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  displayedColumns: string[] = ['name', 'floor', 'capacity', 'details', 'actions'];
  searchFormControl = new FormControl(); // Add a form control for search
  filteredRooms: Room[] = []; 
  id:number | undefined;

  constructor(
    private roomService: RoomService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.fetchRooms();
  }


  fetchRooms(): void {
    this.roomService.getRooms().subscribe(
      (rooms) => {
        this.rooms = rooms;
      },
      (error) => {
        console.error('Error fetching rooms:', error);
      }
    );
  }

  filterRooms(): void {
    const searchTerm = this.searchFormControl.value.toLowerCase();
    this.filteredRooms = this.rooms.filter((room) =>
      room.name.toLowerCase().includes(searchTerm) ||
      room.floor.toLowerCase().includes(searchTerm) ||
      room.capacity.toString().toLowerCase().includes(searchTerm) ||
      room.details.toLowerCase().includes(searchTerm)
    );
  }

  edit(){
    console.log("Edit clicked");
  }

  delete(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: `Are you sure you want to delete this room?`,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        
        this.roomService.deleteRoom(50).subscribe(
          () => {
            console.log('Room deleted successfully.');
            this.fetchRooms();
            this.notificationService.getMessage("Room deleted successfully.");
          },
          (error: any) => {
            console.error('Error deleting room:', error);
          }
        );
      }
    });
  }

  openAddDialog(){
    const dialogRef = this.dialog.open(FormComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchRooms();
    });
  }
}
