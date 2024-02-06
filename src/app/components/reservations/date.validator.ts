import { AbstractControl, ValidatorFn } from '@angular/forms';

export class DateValidator {
    static futureDateValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          const selectedDate = new Date(control.value);
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero for comparison
          
          if (selectedDate < currentDate) {
            return { 'pastDate': { value: control.value } };
          }
          return null;
        };
      }
 }

