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
  @ViewChild('stepper') stepper!: MatStepper; 

  myControl = new FormControl('');
  reservationPurposes: string[] = ['Class', 'Exam', 'Thesis Defense', 'Student Org. Project'];
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
    });

    this.secondFormGroup = this._formBuilder.group({
      date: ['', [Validators.required, DateValidator.futureDateValidator()]] // Apply the custom validator
    });

    this.thirdFormGroup = this._formBuilder.group({
    });

    this.updateRoomSelectedValidator();


    this.fourthFormGroup = this._formBuilder.group({
    });
    
    this.nameFormControl.valueChanges.subscribe((value: string | null) => {
      if (value !== null) { 
        this.name = value;
      }
    });
    
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
    }
  
    if (this.chosenPurpose !== 'Student Org. Project') {
      this.firstFormGroup.get('projectName')?.reset('');
      this.firstFormGroup.get('studentOrganization')?.reset('');
      this.firstFormGroup.get('projectDescription')?.reset('');
    }
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
    if (this.selectedRooms.length > 0 && this.chosenDate) {
      const selectedDateStr = this.chosenDate.toString();
      this.reservedTimeSlots = []; // Clear reserved time slots before fetching new ones
  
      this.selectedRooms.forEach(room => {
        this.reservationService.getReservedTimeSlots(room.roomId, selectedDateStr).subscribe((reservedTimeSlots: any[]) => {
          const convertedSlots = reservedTimeSlots.map(slot => {
            return slot.startTime.split(':')[0] + ':00 - ' + slot.endTime.split(':')[0] + ':00';
          });
          this.reservedTimeSlots.push(...convertedSlots);
          
  
          // Check if this is the last room before updating the reserved time slots
          if (room === this.selectedRooms[this.selectedRooms.length - 1]) {
            // After fetching all reserved time slots, navigate to the next step
            }
        });
      });
      
    }
  }

  onTimeSlotSelected(timeSlot: string) {
    if (this.selectedTimeSlot === timeSlot) {
      this.selectedTimeSlot = undefined;
      this.isSelectedTimeSlot = false;
    } else {
      this.selectedTimeSlot = timeSlot;
      this.isSelectedTimeSlot = true;
    }
  }

  onFinishButtonClick() {
    try {
        if (this.selectedTimeSlot) {

            const roomIds: number[] = this.selectedRooms.map(room => room.roomId);

            const reservationData: ReservationData = {
              name: this.firstFormGroup.get('name')?.value,
              purpose: this.firstFormGroup.get('purpose')?.value,
              roomIds: roomIds,
              username: localStorage.getItem('username') || '',
              semester: this.firstFormGroup.get('semester')?.value,
              typeOfClass: this.firstFormGroup.get('typeOfClass')?.value, // Adjust this based on your form structure
              studyLevel: this.firstFormGroup.get('studyLevel')?.value,
              thesisSupervisor : this.firstFormGroup.get('thesisSupervisor')?.value,
              thesisCommitteeMembers: this.firstFormGroup.get('thesisCommitteeMembers')?.value,
              projectOrganization: this.firstFormGroup.get('studentOrganization')?.value, // Adjust this based on your form structure
              projectName: this.firstFormGroup.get('projectName')?.value,
              projectDescription: this.firstFormGroup.get('projectDescription')?.value
          };

            const timeSlotData: TimeSlotData = {
                date: this.chosenDate,
                startTime: this.selectedTimeSlot.split(' - ')[0],
                endTime: this.selectedTimeSlot.split(' - ')[1],
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
                if (result) {
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
    this.fourthFormGroup.reset();
    
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