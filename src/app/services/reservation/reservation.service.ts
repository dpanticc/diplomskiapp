import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ReservationData } from 'src/app/models/reservation.model';
import { TimeSlotData } from 'src/app/models/time-slot.model';
import { ReservationDTO } from 'src/app/models/reservationDTO.model';
import { catchError, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl = 'http://localhost:8080/api/user';
  private adminUrl = 'http://localhost:8080/api/admin';


  constructor(private http: HttpClient) {}

  createReservation(reservationData: ReservationData, selectedTimeSlot: TimeSlotData): Observable<any> {
    const url = `${this.baseUrl}/reservations`;

    // Create a wrapper object to hold both reservationData and selectedTimeSlot
    const ReservationTimeSlotDTO = {
      reservationDTO: reservationData,
      timeSlotDTO: selectedTimeSlot
    };

    console.log(reservationData);

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

  getAcceptedReservations(): Observable<ReservationDTO[]> {
      const url = `${this.adminUrl}/reservations/accepted`;

      return this.http.get<ReservationDTO[]>(url).pipe(
        catchError((error) => {
          console.error('Error fetching accepted reservations:', error);
          // You can log the error or show a user-friendly message
          return throwError('Failed to fetch accepted reservations. Please try again later.');
        })
      );
    }

    acceptReservation(reservationId: number): Observable<void> {
      const url = `${this.adminUrl}/reservations/accept/${reservationId}`;
      return this.http.put<void>(url, null);
    }

    declineReservation(reservationId: number): Observable<void> {
      const url = `${this.adminUrl}/reservations/decline/${reservationId}`;
      return this.http.put<void>(url, null);    
    }

    getUsersReservations(username: string | null): Observable<ReservationDTO[]> {
    
      // Construct the URL for fetching user's reservations
      const url = `${this.baseUrl}/reservations/${username}`;
    
      // Make the HTTP GET request to fetch user's reservations
      return this.http.get<ReservationDTO[]>(url).pipe(
        catchError((error) => {
          console.error('Error fetching user\'s reservations:', error);
          // You can log the error or show a user-friendly message
          return throwError('Failed to fetch user\'s reservations. Please try again later.');
        })
      );
    }
  }

  
