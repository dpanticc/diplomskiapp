import {Component} from '@angular/core';
import {
  MatDialog,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Room, RoomService } from 'src/app/services/room/room.service';
import { NotificationService } from 'src/app/services/notification/notification.service';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  form: FormGroup;
  
  
  constructor(public dialog: MatDialog, private roomService: RoomService,  private fb: FormBuilder, private notificationService: NotificationService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      floor: ['', Validators.required, Validators.min(-1), Validators.max(6)],
      capacity: [20, [Validators.required, Validators.min(20), Validators.max(300)], this.isNumberValidator],
      details: ['', Validators.required],
    });
  }
 


  onNoClick(): void {
    this.dialog.closeAll();
  }

  addRoom(): void {
    if (this.form.valid) {
      const formData: Room = this.form.value;
      this.roomService.addRoom(formData).subscribe(
        (addedRoom) => {
          console.log('Room added successfully:', addedRoom);
          this.dialog.closeAll();
        },
        (error) => {
          console.error('Error adding room:', error);
        }
      );
    }else{
      this.notificationService.getMessage("Room atributes are not valid!");

    }
  }
  isNumberValidator(control: AbstractControl): Promise<{ [key: string]: boolean } | null> {
    const value = control.value;
    return new Promise((resolve) => {
      // Simulate an asynchronous operation (e.g., API call)
      setTimeout(() => {
        if (isNaN(value)) {
          resolve({ 'notANumber': true });
        } else {
          resolve(null);
        }
      }, 0);
    });
  }
}
