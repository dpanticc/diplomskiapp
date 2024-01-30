import {Component, ViewChild} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { UserService } from 'src/app/services/user/user.service';
import { LoginService } from 'src/app/services/user/login.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, MatIconModule],
  providers: [UserService],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  doneFormGroup = this._formBuilder.group({
  });

  isValidPassword = false; // Set to false initially


  hidePassword: boolean = true;


  @ViewChild('stepper') stepper!: MatStepper; // Add the non-null assertion operator here


  constructor(private _formBuilder: FormBuilder, private loginService: LoginService, private notificationService: NotificationService, public dialogRef: MatDialogRef<StepperComponent>) {}

  async verifyCurrentPassword() {
    const firstCtrl = this.firstFormGroup.get('firstCtrl');
    const username = localStorage.getItem('username');

    if (firstCtrl && firstCtrl.value && username) {
        const currentPassword = firstCtrl.value;
        this.secondFormGroup.disable();

        try {
            // Use your user service to verify the current password
            
            this.isValidPassword = await this.loginService.verifyCurrentPassword(username, currentPassword);

            if (this.isValidPassword) {
                // Enable the next step and button if the current password is valid
                console.log("Password is valid");
                this.secondFormGroup.enable();
                this.stepper.next();
      
            } else {
                console.log("Password not valid");
                this.notificationService.getMessage("Password is not valid!")
            }
        } catch (error) {
            console.error('Error verifying current password', error);
            // Handle the error
        }
    }
}

async updatePassword() {
  const newPassword = this.secondFormGroup.get('secondCtrl')?.value;
  const confirmNewPassword = this.thirdFormGroup.get('thirdCtrl')?.value;
  const username = localStorage.getItem('username');

  if (newPassword === confirmNewPassword && username && newPassword) {
    try {
      // Wait for the asynchronous operation to complete
      const isUpdated = await this.loginService.updatePassword(username, newPassword);
      console.log(isUpdated);
      if (isUpdated) {
        this.notificationService.getMessage("Password updated successfully");
        this.doneFormGroup.enable();
        this.stepper.next(); // Move to the next step if passwords match
      } else {
        console.log("Password not updated");
        this.notificationService.getMessage("Server error");
      }
    } catch (error) {
      console.error('Error updating password', error);
      this.notificationService.getMessage("Server error");
    }
  } else {
    // Passwords don't match or other validation failed
    this.notificationService.getMessage("Passwords don't match. Try again!");
    this.doneFormGroup.disable(); // Disable it if there's an error
    this.stepper.selectedIndex = 2; // Go back to the third step (you can adjust the index based on your actual step indices)
  }
}


  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  };
  close(){
    this.dialogRef.close();
  }
}
