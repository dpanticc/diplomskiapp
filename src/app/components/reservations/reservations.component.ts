import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, ValidatorFn, AbstractControl, FormGroup, ValidationErrors} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {AsyncPipe, CommonModule, DatePipe} from '@angular/common';
import { DateValidator } from './date.validator';
import { RoomstableComponent } from '../roomstable/roomstable.component';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, provideNativeDateAdapter} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CustomDateAdapter, MY_DATE_FORMATS } from './custom.date.adapter';
import { Room, RoomService } from 'src/app/services/room/room.service';
import {MatChipsModule} from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
 
function roomSelectedValidator(roomSelected: boolean): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (!roomSelected) {
      return { 'roomNotSelected': true }; // Return an error object if room is not selected
    }
    return null; // Return null if validation passes
  };
}


@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [ MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
    RoomstableComponent,
    MatDatepickerModule,
    MatSelectModule,
    CommonModule,
    MatChipsModule,
    MatCardModule

  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  providers: [ provideNativeDateAdapter(), DatePipe,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})

export class ReservationsComponent {
  @ViewChild('input', { static: true }) input!: ElementRef<HTMLInputElement>;
  myControl = new FormControl('');
  reservationPurposes: string[] = ['Lecture', 'Exam', 'Public Meeting', 'Internal Meeting', 'Conference'];
  filteredOptions: string[] | undefined;
  selectedDate: Date | null = null; 

  firstFormGroup: FormGroup ;
  secondFormGroup: FormGroup ;
  thirdFormGroup: FormGroup ;
  fourthFormGroup: FormGroup ;

  chosenPurpose: string | undefined;
  chosenDate: string | undefined;
  roomSelected: boolean = false;

  rooms: Room[] = [];
  selectedRooms: Room[] = [];   

  nameFormControl = new FormControl('', [Validators.required]);
  name: string | null | undefined;
  timeSlots: string[] = ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'];


  reservedTimeSlots: any[] = []; 



  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private roomService: RoomService, private reservationService: ReservationService) {
    this.filteredOptions = this.reservationPurposes.slice();

    this.firstFormGroup = this._formBuilder.group({
      purpose: ['', Validators.required],
      name: this.nameFormControl
    });

    this.secondFormGroup = this._formBuilder.group({
      date: ['', [Validators.required, DateValidator.futureDateValidator()]] // Apply the custom validator
    });

    this.thirdFormGroup = this._formBuilder.group({
    });

    this.updateRoomSelectedValidator();


    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
    
    this.nameFormControl.valueChanges.subscribe((value: string | null) => {
      if (value !== null) { 
        this.name = value;
      }
    });
    
  }
 
 
  onPurposeChange(purpose: string) {
    this.chosenPurpose = purpose;
    
  }
  
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.chosenDate = this.datePipe.transform(event.value, 'dd.MM.yyyy.')!;
  }

  onThirdStepEntered() {
  if (this.chosenPurpose) {
    this.roomService.getRoomsByPurpose(this.chosenPurpose).subscribe((rooms: Room[]) => {
      this.rooms = rooms; 
    });
  }
}



  onSelectedRoomsChange(selectedRooms: Room[]) {
    console.log('Selected this  comp rooms:', selectedRooms);
    this.selectedRooms = selectedRooms;
  }


  onRoomSelected(selected: boolean) {
    this.roomSelected = selected;
    this.updateRoomSelectedValidator(); // Update the validator when roomSelected changes

  }

  private updateRoomSelectedValidator() {
    const validator = roomSelectedValidator(this.roomSelected);
    this.thirdFormGroup.setValidators(validator);
    this.thirdFormGroup.updateValueAndValidity(); // Trigger validation update
  }

  isTimeSlotReserved(timeSlot: any): boolean {
    // Check if the provided time slot is reserved
    return this.reservedTimeSlots.some(reservedSlot => reservedSlot.startTime === timeSlot.startTime && reservedSlot.endTime === timeSlot.endTime);
  }
  
  onNextButtonClick() {
    if (this.selectedRooms.length > 0) {
      const selectedDate = this.chosenDate; // Assuming you have already set chosenDate
      if (selectedDate) {
        this.selectedRooms.forEach(room => {
          this.reservationService.getReservedTimeSlots(selectedDate, room.roomId).subscribe((timeSlots: string[]) => {
            // Do something with the time slots for this room
            console.log('Time slots for room', room.roomId, ':', timeSlots);
            // You may want to merge the time slots from different rooms into a single array here
          });
        });
      }
    }
  }
}

