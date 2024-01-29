import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PeriodicElement, UserService } from 'src/app/services/user/user.service';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { StepperComponent } from '../stepper/stepper.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, HttpClientModule, RouterModule, CommonModule, MatCardModule, MatStepperModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  providers:[JwtHelperService]
})


export class AccountComponent implements OnInit {
  hidePassword: boolean = true;
  accountForm!: FormGroup;
  originalFormValues: any;
  isFormDirty: boolean = false;
  private alwaysEnableCancelButton: boolean = false;
  private passwordChangeStepperOpened: boolean = false;


  @ViewChild('stepper') private stepper!: MatStepper;

  
  constructor(private formBuilder: FormBuilder, public userService: UserService, private jwtHelper: JwtHelperService, private notificationService: NotificationService,
    private dialog: MatDialog) {

    this.accountForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      });
  }

  ngOnInit(): void {
    this.getUserData().subscribe(username => {
      this.userService.getUserByUsername(username).subscribe(
        (user: PeriodicElement | null) => {
        if (user) {
          this.accountForm = this.formBuilder.group({
            username: [user.username, [Validators.required, Validators.minLength(3)]],
            email: [{ value: user.email, disabled: true }, [Validators.required, Validators.email]],
            firstName: [user.firstName, Validators.required],
            lastName: [user.lastName, Validators.required],
          });
  
          // Initialize originalFormValues after getting user data
          this.originalFormValues = { ...this.accountForm.value };
        } else {
          console.error(`User with username ${username} not found.`);
          // Handle the case where the user is not found, e.g., redirect or show an error message
        }
      },
      (error: any) => {
        console.error('Error fetching user data', error);
        // Handle the error, e.g., redirect or show an error message
      }
    );
  });
  }
  

  getUserData(): Observable<string> {
    const username = localStorage.getItem('username');
  
    if (username) {
      console.log(username);
      return of(username);
    } else {
      throw new Error('No username available in local storage.');
    }
  }
  
  saveUser() {
    this.getUserData().subscribe(username => {
      this.userService.getUserByUsername(username).subscribe(
        (user: PeriodicElement | null) => {
          if (user) {
            const userData = { ...this.accountForm.value, id: user.id };
  
            console.log(userData);
  
            this.userService.saveUser(userData).subscribe(
              (response: any) => {
                console.log('User saved successfully', response);
  
                // Update the username in localStorage with the updated value from the response
                localStorage.setItem('username', response.username);
  
                // Set originalFormValues to the updated values
                this.originalFormValues = { ...this.accountForm.value };
                
                this.notificationService.getMessage(`Successfully changed account information`);


                // Reset the form to its original values
                this.resetForm();
  
              },
              (error: any) => {
                console.error('Error saving user', error);
              }
            );
          } else {
            console.error(`User with username ${username} not found.`);
          }
        },
        (error: any) => {
          console.error('Error fetching user data', error);
        }
      );
    });
  }
  resetForm() {
    // Enable the 'email' control temporarily
    const emailControl = this.accountForm.get('email');
    emailControl?.enable();
  
    // Iterate through form controls and set values
    Object.keys(this.originalFormValues).forEach(controlName => {
      const control = this.accountForm.get(controlName);
      if (control) {
        control.setValue(this.originalFormValues[controlName]);
      }
    });
  
    // Disable the 'email' control again
    emailControl?.disable();
  
    this.isFormDirty = false;
  
    this.accountForm.markAsPristine();
  }

    // Check if there are changes in the form
    checkFormChanges() {
      this.isFormDirty = !this.areObjectsEqual(this.originalFormValues, this.accountForm.value);
    }
  
    // Helper function to compare two objects
    areObjectsEqual(obj1: any, obj2: any) {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
  
    // Reset the form to its original values
    cancelChanges() {
      // Enable the 'email' control temporarily
      const emailControl = this.accountForm.get('email');
      emailControl?.enable();
    
      // Iterate through form controls and set values
      Object.keys(this.originalFormValues).forEach(controlName => {
        const control = this.accountForm.get(controlName);
        if (control) {
          control.setValue(this.originalFormValues[controlName]);
        }
      });
    
      // Disable the 'email' control again
      emailControl?.disable();
    
      this.isFormDirty = false;
    
      this.accountForm.markAsPristine();
    }
    
    openPasswordChangeStepper() {
      this.dialog.open(StepperComponent, {
        width: '500px', // Adjust the width as needed
      });
    }
}
