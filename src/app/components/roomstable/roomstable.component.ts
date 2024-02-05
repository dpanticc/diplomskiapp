import {Component} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Room } from 'src/app/services/room/room.service';

const ELEMENT_DATA: Room[] = [
  {roomId: 1, name: 'B301', floor:'prvi', details: 'Sala za sastanke', capacity:250},
  {roomId: 2, name: '123', floor:'prvi', details: 'Amfiteatar', capacity:250},
  {roomId: 3, name: 'B402', floor:'prvi', details: 'Racunarski centar', capacity:250},
  {roomId: 4, name: '015', floor:'prvi', details: 'Sala za predavanja', capacity:250},

];

@Component({
  selector: 'app-roomstable',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule],
  templateUrl: './roomstable.component.html',
  styleUrl: './roomstable.component.css'
})



export class RoomstableComponent {
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<Room>(ELEMENT_DATA);
  selection = new SelectionModel<Room>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Room): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.roomId + 1}`;
  }
}
