import { ReservationStatus } from "./time-slot.model";

export interface ReservationDTO {
    name: string | null | undefined;
    purpose: string | undefined;
    roomIds: number[] | undefined; // Change to an array of room IDs
    username: string | null | undefined;
    date: string | undefined;
    startTime: string | undefined;
    endTime: string | undefined;
    status: ReservationStatus;
    theme: string | undefined;
    room?: string; // Add the room property as an optional string
    timeSlot?: string; // Add the timeSlot property as an optional string
  }