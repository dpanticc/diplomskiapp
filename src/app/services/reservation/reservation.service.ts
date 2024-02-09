import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = 'http://localhost:8080/api/user';

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
}