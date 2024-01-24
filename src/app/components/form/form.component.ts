import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Room, RoomService } from 'src/app/services/room/room.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { room: Room },
    public dialogRef: MatDialogRef<FormComponent>,
    private roomService: RoomService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      floor: ['', Validators.required],
      capacity: [20, [Validators.required, Validators.min(20), Validators.max(300)]],
      details: ['', Validators.required],
    });

    if (data.room) {
      this.form.patchValue(data.room); // Pre-fill the form with existing values when editing
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    if (this.form.valid) {
      const formData: Room = this.form.value;
  
      if (this.data && this.data.room) {
        // If there is a room in the data, it means we are editing
        this.roomService.updateRoom(this.data.room.roomId, formData).subscribe(
          (updatedRoom) => {
            console.log('Room updated successfully:', updatedRoom);
            this.dialogRef.close();
            this.notificationService.getMessage(`Room "${updatedRoom.name}" successfully updated!`);

          },
          (error) => {
            console.error('Error updating room:', error);
          }
        );
      } else {
        // Otherwise, we are adding a new room
        this.roomService.addRoom(formData).subscribe(
          (addedRoom) => {
            console.log('Room added successfully:', addedRoom);
            this.notificationService.getMessage(`Room "${formData.name}" added successfully!`);

            this.dialogRef.close();
            
          },
          (error) => {
            console.error('Error adding room:', error);
          }
        );
      }
    } else {
      this.notificationService.getMessage('Room attributes are not valid!');
    }
  }
}
