import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBar  } from '@angular/material/snack-bar';


@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data1: any, private _snackBar: MatSnackBar) {}

  dismiss(){
    this._snackBar.dismiss()
  }
}
