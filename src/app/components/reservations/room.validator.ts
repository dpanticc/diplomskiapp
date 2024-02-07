import { AbstractControl, ValidatorFn } from '@angular/forms';

export class RoomValidator {
    static selectedRoomsValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const selectedRooms = control.value;
            
            if (!selectedRooms || selectedRooms.length === 0) {
                return { 'noRoomsSelected': true };
            }
            
            return null;
        };
    }
}
