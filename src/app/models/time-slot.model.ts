export enum ReservationStatus {
    Reserved = 'RESERVED',
    Pending = 'PENDING',
    Canceled = 'CANCELED',
  }
  
  export interface TimeSlotData {
    date: string | undefined;
    startTime: string | undefined;
    endTime: string | undefined;
    status: ReservationStatus;
  }