  import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
  import {SelectionModel} from '@angular/cdk/collections';
  import {MatTableDataSource, MatTableModule} from '@angular/material/table';
  import {MatCheckboxModule} from '@angular/material/checkbox';
  import { Room } from 'src/app/services/room/room.service';

  @Component({
    selector: 'app-roomstable',
    standalone: true,
    imports: [MatTableModule, MatCheckboxModule],
    templateUrl: './roomstable.component.html',
    styleUrl: './roomstable.component.css',
    
  })

  export class RoomstableComponent implements OnChanges {
    @Input() rooms: Room[] = [];
    @Input() chosenPurpose: string | undefined;
    @Output() selectedRoomsChange = new EventEmitter<Room[]>();
    @Output() roomSelected = new EventEmitter<boolean>();

    displayedColumns: string[] = ['select', 'name', 'floor', 'details', 'capacity'];
    dataSource = new MatTableDataSource<Room>([]); // Initialize with an empty array
    selection = new SelectionModel<Room>(true, []);
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['chosenPurpose'] && changes['chosenPurpose'].currentValue !== changes['chosenPurpose'].previousValue) {
        this.clearSelectedRooms();
      }
      if (changes['rooms'] && changes['rooms'].currentValue) {
        const receivedRooms = changes['rooms'].currentValue;
        this.dataSource.data = receivedRooms;
      }
    }

    
    clearSelectedRooms() {
      this.selection.clear();
      this.emitSelectedRooms();
    }
  
    emitSelectedRooms() {
      this.selectedRoomsChange.emit(this.selection.selected);
      this.roomSelected.emit(this.selection.selected.length > 0);
    }
    
  }
