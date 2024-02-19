import {AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, ViewChild} from '@angular/core';
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
import { forkJoin, timeout } from 'rxjs';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-manager',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './reservation-manager.component.html',
  styleUrl: './reservation-manager.component.css'
})
export class ReservationManagerComponent implements OnInit, AfterViewInit, OnChanges {
  displayedColumnsRequest: string[] = ['name', 'purpose', 'room', 'date', 'timeSlot', 'username', 'accept-decline'];
  displayedColumns: string[] = ['name', 'purpose', 'room', 'date', 'timeSlot', 'username', 'cancel'];

  dataSourceRequested: MatTableDataSource<ReservationDTO>;
  dataSourceAccepted: MatTableDataSource<ReservationDTO>;

  @ViewChild('paginatorRequest', { static: false }) paginatorRequest!: MatPaginator;
  @ViewChild('paginatorAccepted', { static: false }) paginatorAccepted!: MatPaginator;

  @ViewChild(MatSort) sortRequest!: MatSort;
  @ViewChild(MatSort) sortAccepted!: MatSort;

  constructor(
    private reservationService: ReservationService,
    private roomService: RoomService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSourceRequested = new MatTableDataSource<ReservationDTO>([]);
    this.dataSourceAccepted = new MatTableDataSource<ReservationDTO>([]);
    
  }

  ngOnInit(): void {
    this.dataSourceRequested.paginator = this.paginatorRequest;
    this.dataSourceAccepted.paginator = this.paginatorAccepted;

    this.dataSourceRequested.sort = this.sortRequest;
    this.dataSourceAccepted.sort = this.sortAccepted;
  }

  ngAfterViewInit(): void {

    this.fetchData();
  }

  ngOnChanges(): void {
    this.fetchData(); 
  }


  fetchData() {
    // Fetch both pending and accepted reservations
    const fetchPending$ = this.reservationService.getPendingReservations();
    const fetchAccepted$ = this.reservationService.getAcceptedReservations();

    forkJoin([fetchPending$, fetchAccepted$]).subscribe(
      ([pendingReservations, acceptedReservations]) => {
        // Update data sources and set paginator and sort after fetching data
        this.updateDataSource(pendingReservations, this.dataSourceRequested, this.paginatorRequest, this.sortRequest);
        this.updateDataSource(acceptedReservations, this.dataSourceAccepted, this.paginatorAccepted, this.sortAccepted);
      },
      (error) => {
        console.error('Error fetching reservations', error);
      }
    );
  }

  fetchPendingReservations() {
    this.reservationService.getPendingReservations().subscribe((reservations) => {
      this.updateDataSource(reservations, this.dataSourceRequested, this.paginatorRequest, this.sortRequest);
    });
  }

  fetchAcceptedReservations() {
    this.reservationService.getAcceptedReservations().subscribe((reservations) => {
      this.updateDataSource(reservations, this.dataSourceAccepted, this.paginatorAccepted, this.sortAccepted);
    });
  }

  private updateDataSource(
    reservations: ReservationDTO[],
    dataSource: MatTableDataSource<ReservationDTO>,
    paginator: MatPaginator,
    sort: MatSort
  ) {
    const roomNameRequests = reservations.map(reservation => this.roomService.getRoomNamesByIds(reservation.roomIds));

    forkJoin(roomNameRequests).subscribe((roomNamesArray: string[][]) => {
      console.log('Room Names Array:', roomNamesArray);
     
      const formattedReservations = reservations.map((reservation, index) => {
        const startTime = reservation.startTime;
        const endTime = reservation.endTime;
        const timeSlot = `${startTime} - ${endTime}`;
        const roomNames = roomNamesArray[index].join(', ');
        console.log(roomNames);

        return { ...reservation, timeSlot, roomNames };
      });
     
      dataSource.data = formattedReservations;

      // Reset paginator to the first page
      
      dataSource.paginator = paginator;
      dataSource.sort = sort;

      // Ensure the paginator starts at the first page
      if (dataSource.paginator) {
        dataSource.paginator.firstPage();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAccepted.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceAccepted.paginator) {
      this.dataSourceAccepted.paginator.firstPage();
    }
  }

  applyFilterRequested(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceRequested.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceRequested.paginator) {
      this.dataSourceRequested.paginator.firstPage();
    }
  }

  acceptReservation(reservation: any) {
    console.log(reservation);
    this.reservationService.acceptReservation(reservation.reservationId).subscribe(() => {
      this.notificationService.getMessage(reservation.name + ' has been successfully reserved.');
      this.fetchPendingReservations();
      this.fetchAcceptedReservations();
    });
  }

  declineReservation(reservation: any) {
    console.log('declined from accepted' + reservation.name);
    console.log(this.dataSourceRequested.data);
    this.reservationService.declineReservation(reservation.reservationId).subscribe(() => {
      this.fetchAcceptedReservations(); // Refresh the active reservations table
      this.fetchPendingReservations();
      this.notificationService.getMessage(reservation.name + ' has been canceled.');
      console.log(this.dataSourceRequested.data);
    });
  }
}