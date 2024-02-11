import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  addRoom(newRoom: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, newRoom);
  }

  deleteRoom(roomId: number) {
    return this.http.delete<void>(`${this.apiUrl}?room=${roomId}`);
  }

  updateRoom(id: number, formData: Room): Observable<Room> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Room>(url, formData);
  }

  getRoomsByPurpose(purpose: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.userUrl}?purpose=${purpose}`);
  }
}

export interface Room {
  roomId: number;
  name: string;
  floor: string;
  capacity: number;
  details: string;
  
  
}
