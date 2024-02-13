import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';



export interface ReservationData {
  id: string;
  name: string;
  purpose: string;
  room: string;
  date: string;
  timeSlot: string;
  username: string;
}

const PURPOSES: string[] = ['Meeting', 'Conference', 'Training'];
const ROOMS: string[] = ['Room 1', 'Room 2', 'Room 3'];
const DATES: string[] = ['2024-02-01', '2024-02-02', '2024-02-03'];
const TIME_SLOTS: string[] = ['9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00'];
const USERNAMES: string[] = ['user1', 'user2', 'user3'];

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

  dataSource: MatTableDataSource<ReservationData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    const reservations = Array.from({ length: 100 }, (_, k) => createNewReservation(k + 1));
    this.dataSource = new MatTableDataSource(reservations);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

function createNewReservation(id: number): ReservationData {
  const purpose = PURPOSES[Math.floor(Math.random() * PURPOSES.length)];
  const room = ROOMS[Math.floor(Math.random() * ROOMS.length)];
  const date = DATES[Math.floor(Math.random() * DATES.length)];
  const timeSlot = TIME_SLOTS[Math.floor(Math.random() * TIME_SLOTS.length)];
  const username = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
  return {
    id: id.toString(),
    name: `Reservation ${id}`,
    purpose: purpose,
    room: room,
    date: date,
    timeSlot: timeSlot,
    username: username
  };
}