import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { ReservationDTO } from 'src/app/models/reservationDTO.model';
import { RoomService } from 'src/app/services/room/room.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reservation-manager',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatCardModule, MatButtonModule],
  templateUrl: './reservation-manager.component.html',
  styleUrl: './reservation-manager.component.css'
})
export class ReservationManagerComponent implements AfterViewInit {
  displayedColumnsRequest: string[] = ['name', 'purpose', 'room', 'date', 'timeSlot', 'username', 'accept-decline'];
  displayedColumns: string[] = ['name', 'purpose', 'room', 'date', 'timeSlot', 'username', 'cancel'];

  dataSource: MatTableDataSource<ReservationDTO>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private reservationService: ReservationService,  private roomService: RoomService  ) {
    this.dataSource = new MatTableDataSource<ReservationDTO>([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchPendingReservations();
  }

  fetchPendingReservations() {
    this.reservationService.getPendingReservations().subscribe((reservations) => {

      
      // Fetch room names for each reservation
      const roomNameRequests = reservations.map(reservation => this.roomService.getRoomNamesByIds(reservation.roomIds));
  
      // Use forkJoin to combine multiple observables into one
      forkJoin(roomNameRequests).subscribe((roomNamesArray: string[][]) => {
        // Update the dataSource with formatted data
        const formattedReservations = reservations.map((reservation, index) => {
          const startTime = reservation.startTime;
          const endTime = reservation.endTime;
          const timeSlot = `${startTime} : ${endTime}`;
          
          
          // Assuming roomNamesArray[index] contains the room names for the current reservation
          const roomNames = roomNamesArray[index].join(', ');
          
          return { ...reservation, timeSlot, roomNames };
        });
  
        // Update the dataSource with formatted reservations
        this.dataSource.data = formattedReservations;
        
        // Set paginator and sort
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        console.log(formattedReservations);
      });
    });
  }

  
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
