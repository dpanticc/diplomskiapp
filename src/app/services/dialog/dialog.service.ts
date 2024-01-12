import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  getMessage(message: string){

    this.dialog.open(DialogComponent, {
      data: { message: message },
      disableClose: true
    });
  }
}
