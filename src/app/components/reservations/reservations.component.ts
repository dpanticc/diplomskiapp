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
import { ReservationStatus, TimeSlotData } from 'src/app/models/time-slot.model';
import { ReservationData } from 'src/app/models/reservation.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { NgxMatTimepickerComponent, NgxMatTimepickerFieldComponent } from 'ngx-mat-timepicker';
import { MatIconModule } from '@angular/material/icon';

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
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  providers: [ provideNativeDateAdapter(), DatePipe,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})

export class ReservationsComponent {
  @ViewChild('input', { static: true }) input!: ElementRef<HTMLInputElement>;
  @ViewChild('stepper') stepper!: MatStepper; 

  myControl = new FormControl('');
  reservationPurposes: string[] = ['Class', 'Exam', 'Thesis Defense', 'Student Org. Project'];
  filteredOptions: string[] | undefined;
  selectedDate: Date | null = null; 

  startTimeOptions: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  endTimeOptions: string[] = [];
  chosenStartTime: string | undefined;
  chosenEndTime: string | undefined = '';

  firstFormGroup: FormGroup ;
  secondFormGroup: FormGroup ;
  thirdFormGroup: FormGroup ;

  chosenPurpose: string | undefined;
  chosenDate: string | undefined;
  roomSelected: boolean = false;

  rooms: Room[] = [];
  selectedRooms: Room[] = [];   

  nameFormControl = new FormControl('', [Validators.required]);
  name: string | null | undefined;

  selectedTimeSlot: string | undefined;

  isSelectedTimeSlot : boolean = false;


  reservedTimeSlots: any[] = []; 

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private roomService: RoomService, private reservationService: ReservationService,
    private dialog: MatDialog
    ) {
    this.filteredOptions = this.reservationPurposes.slice();

    this.firstFormGroup = this._formBuilder.group({
      purpose: ['', Validators.required],
      name: this.nameFormControl,
      typeOfClass: [''],
      semester: [''],
      studyLevel: [''],
      studyLevelThesis: [''],
      supervisor: [''],
      committeeMembers: [''],
      projectName: [''],
      studentOrganization: [''],
      projectDescription: [''],
      thesisSupervisor: [''],
      thesisCommitteeMembers: [''],
      theme: ['']
    });

    this.secondFormGroup = this._formBuilder.group({
      date: ['', [Validators.required, DateValidator.futureDateValidator()]],
      startTime: ['', [Validators.required]],   
      endTime: ['', [Validators.required]],    
    });

    this.thirdFormGroup = this._formBuilder.group({
    });

    this.updateRoomSelectedValidator();
    
    this.nameFormControl.valueChanges.subscribe((value: string | null) => {
      if (value !== null) { 
        this.name = value;
      }
    });
    
  }


  onEndTimeChange(selectedEndTime: string) {
    this.chosenEndTime = selectedEndTime;
  }
  
  onStartTimeChange(selectedStartTime: string): void {
    // Update the options for End Time based on the selected Start Time
    const selectedIndex = this.startTimeOptions.indexOf(selectedStartTime);
    this.endTimeOptions = this.startTimeOptions.slice(selectedIndex + 1);
    this.secondFormGroup.get('endTime')?.setValue(null); // Reset the selected End Time
    this.chosenStartTime = selectedStartTime; // Set chosenTime when Start Time changes
  }
 
 
  onPurposeChange(purpose: string) {
    this.chosenPurpose = purpose;
    
    if (this.chosenPurpose !== 'Class') {
      this.firstFormGroup.get('typeOfClass')?.reset('');
      this.firstFormGroup.get('semester')?.reset('');
      this.firstFormGroup.get('studyLevel')?.reset('');
    }

    if (this.chosenPurpose !== 'Exam') {
      this.firstFormGroup.get('semester')?.reset('');
      this.firstFormGroup.get('studyLevel')?.reset('');
    }
  
  
    if (this.chosenPurpose !== 'Thesis Defense') {
      this.firstFormGroup.get('studyLevelThesis')?.reset('');
      this.firstFormGroup.get('supervisor')?.reset('');
      this.firstFormGroup.get('committeeMembers')?.reset('');
      this.firstFormGroup.get('theme')?.reset('');
    }
  
    if (this.chosenPurpose !== 'Student Org. Project') {
      this.firstFormGroup.get('projectName')?.reset('');
      this.firstFormGroup.get('studentOrganization')?.reset('');
      this.firstFormGroup.get('projectDescription')?.reset('');
    }
    Object.keys(this.firstFormGroup.controls).forEach(controlName => {
      const control = this.firstFormGroup.get(controlName);
      if (control) {
        control.clearValidators();
      }
    });
  
    // Apply new validators based on the selected purpose
    switch (this.chosenPurpose) {
      case 'Class':
        this.firstFormGroup.get('name')?.setValidators([Validators.required]);
        this.firstFormGroup.get('typeOfClass')?.setValidators([Validators.required]);
        this.firstFormGroup.get('semester')?.setValidators([Validators.required]);
        this.firstFormGroup.get('studyLevel')?.setValidators([Validators.required]);
        break;
      case 'Exam':
        this.firstFormGroup.get('name')?.setValidators([Validators.required]);
        this.firstFormGroup.get('semester')?.setValidators([Validators.required]);
        this.firstFormGroup.get('studyLevel')?.setValidators([Validators.required]);
        break;
      case 'Thesis Defense':
        this.firstFormGroup.get('name')?.setValidators([Validators.required]);
        this.firstFormGroup.get('theme')?.setValidators([Validators.required]);
        this.firstFormGroup.get('studyLevel')?.setValidators([Validators.required]);
        this.firstFormGroup.get('thesisSupervisor')?.setValidators([Validators.required]);
        this.firstFormGroup.get('thesisCommitteeMembers')?.setValidators([Validators.required]);
        break;
      case 'Student Org. Project':
        this.firstFormGroup.get('name')?.setValidators([Validators.required]);
        this.firstFormGroup.get('projectName')?.setValidators([Validators.required]);
        this.firstFormGroup.get('studentOrganization')?.setValidators([Validators.required]);
        this.firstFormGroup.get('projectDescription')?.setValidators([Validators.required]);
        break;
      default:
        // Handle other cases or leave it empty if no specific validation is needed
    }
  
    // Update the form controls with the new validators
    Object.keys(this.firstFormGroup.controls).forEach(controlName => {
      const control = this.firstFormGroup.get(controlName);
      if (control) {
        control.updateValueAndValidity();
      }
    });
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

  this.thirdFormGroup.reset();
}

  onSelectedRoomsChange(selectedRooms: Room[]) {
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

  isTimeSlotReserved(timeSlot: string): boolean {
    return this.reservedTimeSlots.includes(timeSlot);
  }

  
  
  
  onNextButtonClick() {
    if (this.chosenDate && this.chosenEndTime && this.chosenStartTime) {
      const selectedDate = this.chosenDate;
  
      // Format date in 'yyyy-MM-dd'
      const formattedDate = this.formatDate(selectedDate);
      console.log(formattedDate);
      const startTime = this.chosenStartTime;
    const endTime = this.chosenEndTime;

    // Parse start time and end time strings to Date objects
    const startDateObj = new Date(`${formattedDate} ${startTime}`);
    const endDateObj = new Date(`${formattedDate} ${endTime}`);

    // Add one second to start time
    startDateObj.setSeconds(startDateObj.getSeconds());

    // Add one second to end time
    endDateObj.setSeconds(endDateObj.getSeconds());

    // Convert the updated Date objects back to formatted strings
    const updatedStartTime = this.formatTime(startDateObj);
    const updatedEndTime = this.formatTime(endDateObj);

    console.log(updatedStartTime);
    console.log(updatedEndTime);

      this.roomService.getAvailableRooms(formattedDate, startTime, endTime)
        .subscribe((availableRooms: Room[]) => {
          // Now, availableRooms contains rooms that are not reserved during the specified time
          console.log('Available Rooms:', availableRooms);
          this.rooms = availableRooms;
          // You can use this data as needed in your application
        });
    }
}

formatTime(date:any) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Add this method to your component class
private formatDate(date: string): string {
  const selectedDate = new Date(date);
  const year = selectedDate.getFullYear();
  const day = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
  const month = selectedDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}


  onFinishButtonClick() {
    try {
        if (this.chosenDate && this.chosenEndTime && this.chosenStartTime) {

            const roomIds: number[] = this.selectedRooms.map(room => room.roomId);

            const reservationData: ReservationData = {
              name: this.firstFormGroup.get('name')?.value,
              purpose: this.firstFormGroup.get('purpose')?.value,
              roomIds: roomIds,
              theme: this.firstFormGroup.get('theme')?.value,
              username: localStorage.getItem('username') || '',
              semester: this.firstFormGroup.get('semester')?.value,
              typeOfClass: this.firstFormGroup.get('typeOfClass')?.value,
              studyLevel: this.firstFormGroup.get('studyLevel')?.value,
              thesisSupervisor : this.firstFormGroup.get('thesisSupervisor')?.value,
              thesisCommitteeMembers: this.firstFormGroup.get('thesisCommitteeMembers')?.value,
              projectOrganization: this.firstFormGroup.get('studentOrganization')?.value,
              projectName: this.firstFormGroup.get('projectName')?.value,
              projectDescription: this.firstFormGroup.get('projectDescription')?.value
          };

            const timeSlotData: TimeSlotData = {
                date: this.chosenDate,
                startTime: this.chosenStartTime,
                endTime: this.chosenEndTime,
                status: ReservationStatus.Pending, // Set the status using the enum value
              };
              console.log(timeSlotData)

            const dialogRef = this.dialog.open(ConfirmationComponent, {
                width: '400px',
                data: {
                    titlemessage: 'Confirm Reservation Creation',
                    reservationData: reservationData,
                    timeSlotData: timeSlotData,
                    this: this.selectedRooms
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result === true) {
                    // User confirmed, proceed with reservation creation
                    this.stepper.next();
                } else {
                    // User canceled, do nothing or handle cancellation
                }
            });
        } else {
            console.error('No time slot selected');
            // Handle the case where no time slot is selected, e.g., display an error message to the user
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}


  onReset() {
    // Reset form groups
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    
    // Clear component properties
    this.nameFormControl.reset(); // Reset the form control for the name
    this.name = null; // Clear the name property
    this.chosenPurpose = undefined; // Reset the chosen purpose
    this.chosenDate = undefined; // Reset the chosen date
    this.selectedRooms = []; // Clear the selected rooms array
    this.selectedTimeSlot = undefined; // Reset the selected time slot
    this.isSelectedTimeSlot = false; // Reset the flag for selected time slot
    this.reservedTimeSlots = []; // Clear the reserved time slots array
    
    // Reset the stepper (assuming you've fixed the ViewChild issue as mentioned previously)
    this.stepper.reset();
  }
}