import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
 
 

  private apiUrl = 'http://localhost:8080/api/admin/rooms';
  private userUrl = 'http://localhost:8080/api/user/rooms';


  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}`);
  }

  getRoomsByPurpose(purpose: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.userUrl}?purpose=${purpose}`);
  }

  addRoom(newRoom: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, newRoom);
  }

  updateRoom(id: number, formData: Room): Observable<Room> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Room>(url, formData);
  }

  deleteRoom(roomId: number) {
    return this.http.delete<void>(`${this.apiUrl}/${roomId}`);
  }

  
  getRoomNamesByIds(roomIds: number[] | undefined): Observable<string[]> {
    if (!roomIds || roomIds.length === 0) {
      // If roomIds is undefined or an empty array, return an empty array
      return of([]);
    }
  
    // Fetch room names based on room IDs
    const requests = roomIds.map(roomId =>
      this.http.get(`${this.apiUrl}/${roomId}/name`, { responseType: 'text' }).pipe(
        catchError(error => {
          // Log the error and return an empty string to handle non-JSON responses
          console.error(`Error fetching room name for roomId ${roomId}:`, error);
          return of('');
        }),
        map(response => {
          // Ensure the response is a string
          return typeof response === 'string' ? response : '';
        })
      )
    );
  
    // Use forkJoin to combine multiple observables into one
    return forkJoin(requests).pipe(
      catchError(error => {
        console.error('Error fetching room names:', error);
        // Handle the error as needed, and return an empty array
        return of([]);
      })
    );
  }
  
}

export interface Room {
  roomId: number;
  name: string;
  floor: string;
  capacity: number;
  details: string;
}
