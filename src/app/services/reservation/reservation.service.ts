import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ReservationData } from 'src/app/models/reservation.model';
import { TimeSlotData } from 'src/app/models/time-slot.model';
import { ReservationDTO } from 'src/app/models/reservationDTO.model';
import { catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReservationService {
 
  private baseUrl = 'http://localhost:8080/api/user';
  private adminUrl = 'http://localhost:8080/api/admin';


  constructor(private http: HttpClient) {}

  getReservedTimeSlots(roomId: number, date: string): Observable<any> {
    // Retrieve username from local storage
    const username = localStorage.getItem('username');

    // Construct request parameters
    let params = new HttpParams();
    params = params.append('date', date);
    
    // Check if username is not null before adding it to parameters
    if (username !== null) {
      params = params.append('username', username);
    }

    // Make GET request to backend endpoint
    return this.http.get<any>(`${this.baseUrl}/${roomId}/timeslots`, { params });
  }

  createReservation(reservationData: ReservationData, selectedTimeSlot: TimeSlotData): Observable<any> {
    const url = `${this.baseUrl}/reservations`;

    // Create a wrapper object to hold both reservationData and selectedTimeSlot
    const ReservationTimeSlotDTO = {
      reservationDTO: reservationData,
      timeSlotDTO: selectedTimeSlot
    };

    console.log(selectedTimeSlot.status)

    // Make the HTTP POST request with the wrapper object as the request body
    return this.http.post(url, ReservationTimeSlotDTO);
  }

  getPendingReservations(): Observable<ReservationDTO[]> {
    const url = `${this.adminUrl}/reservations/pending`;
  
    return this.http.get<ReservationDTO[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching pending reservations:', error);
        // You can log the error or show a user-friendly message
        return throwError('Failed to fetch pending reservations. Please try again later.');
      })
    );
  }
}