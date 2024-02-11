import { Room } from "../services/room/room.service";

export interface ReservationData {
    name: string | null | undefined;
    purpose: string | undefined;
    roomIds: number[] | undefined; // Change to array of room IDs
    username: string | null | undefined;
}