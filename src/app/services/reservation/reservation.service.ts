import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

 getReservedTimeSlots(date: string, roomId: number): Observable<any[]> {
  return this.http.get<any[]>(`/api/user/${roomId}/timeslots?date=${date}`);
}

}
