import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { 
  }

  getMessage(message: string){

    this._snackBar.openFromComponent(NotificationComponent, {
      data: { message: message },
      verticalPosition: 'top',
    });
  }
}

