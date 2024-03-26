import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-reservation-tables',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './reservation-tables.component.html',
  styleUrl: './reservation-tables.component.css'
})
export class ReservationTablesComponent implements OnChanges {
  @Input() reservations: Array<any> = [];
  dataSource = new MatTableDataSource<any>(); // Change 'any' to your data type
  displayedColumns: string[] = ['name', 'purpose', 'room', 'date', 'timeSlot'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private roomService: RoomService){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservations'] && changes['reservations'].currentValue) {
      const roomNameRequests = this.reservations.map(reservation => this.roomService.getRoomNamesByIds(reservation.reservationDTO.roomIds));
      
      forkJoin(roomNameRequests).subscribe((roomNamesArray: string[][]) => {
        const formattedReservations = this.reservations.map((reservation, index) => {

          const roomNames = roomNamesArray[index].join(', ');
  
          return { ...reservation, roomNames };
        });
  
        // Update the data source with the formatted reservations
        this.dataSource.data = formattedReservations;
  
        // Attach the paginator to the dataSource
        this.dataSource.paginator = this.paginator;
  
        // Log the formatted reservations to the console
        console.log('Formatted Reservations:', formattedReservations);
      });
    }
  }
}
