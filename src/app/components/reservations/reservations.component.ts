import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { RoomstableComponent } from '../roomstable/roomstable.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
  

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
    MatAutocompleteModule,
    RoomstableComponent,
    MatDatepickerModule

  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  providers: [ provideNativeDateAdapter()],
})
export class ReservationsComponent {
  @ViewChild('input', { static: true }) input!: ElementRef<HTMLInputElement>;
  myControl = new FormControl('');
  reservationPurposes: string[] = ['Lecture', 'Exam', 'Public Meeting', 'Internal Meeting', 'Conference'];
  filteredOptions: string[] | undefined;
  
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  })
  thirdFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  fourthFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) {
    this.filteredOptions = this.reservationPurposes.slice();
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.reservationPurposes.filter(o => o.toLowerCase().includes(filterValue));
  }
}
