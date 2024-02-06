  import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
  import {SelectionModel} from '@angular/cdk/collections';
  import {MatTableDataSource, MatTableModule} from '@angular/material/table';
  import {MatCheckboxModule} from '@angular/material/checkbox';
  import { Room } from 'src/app/services/room/room.service';



  @Component({
    selector: 'app-roomstable',
    standalone: true,
    imports: [MatTableModule, MatCheckboxModule],
    templateUrl: './roomstable.component.html',
    styleUrl: './roomstable.component.css'
  })



  export class RoomstableComponent implements OnChanges {
    @Input() rooms: Room[] = [];
  
    displayedColumns: string[] = ['select', 'name', 'floor', 'details', 'capacity'];
    dataSource = new MatTableDataSource<Room>([]); // Initialize with an empty array
  
    selection = new SelectionModel<Room>(true, []);
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['rooms'] && changes['rooms'].currentValue) {
        const receivedRooms = changes['rooms'].currentValue;
        console.log('Received rooms:', receivedRooms);
        this.dataSource.data = receivedRooms;
      }
    }
  
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  
    toggleAllRows() {
      if (this.isAllSelected()) {
        this.selection.clear();
        return;
      }
  
      this.selection.select(...this.dataSource.data);
    }
  
    checkboxLabel(row?: Room): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.roomId + 1}`;
    }
  }
