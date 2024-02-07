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
import { RoomValidator } from './room.validator';
 

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
  selectedDate: Date | null = null; // Define selectedDate property

  firstFormGroup: FormGroup ;
  secondFormGroup: FormGroup ;
  thirdFormGroup: FormGroup ;
  fourthFormGroup: FormGroup ;

  chosenPurpose: string | undefined;
  chosenDate: string | undefined;
  roomSelected: boolean = false;

  rooms: Room[] = [];
  selectedRooms: Room[] = [];   



  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private roomService: RoomService) {
    this.filteredOptions = this.reservationPurposes.slice();

    this.firstFormGroup = this._formBuilder.group({
      purpose: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      date: ['', [Validators.required, DateValidator.futureDateValidator()]] // Apply the custom validator
    });

    this.thirdFormGroup = this._formBuilder.group({
      rooms: [[], [Validators.required, RoomValidator.selectedRoomsValidator()]] // Apply the custom validator for selected rooms
    });

    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
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
  }
}
