import { Component, Injectable } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarModule,
  CalendarView,
  DateAdapter,
  CalendarDateFormatter,
  DateFormatterParams,
  CalendarUtils
} from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
class CustomDateFormatter extends CalendarDateFormatter {
  override monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return super.monthViewColumnHeader({ date, locale });
  }
}

@Injectable()
class CustomDateAdapter extends NativeDateAdapter {
  startOfWeek(): number {
    return 1; // Adjust the value based on your locale (0 for Sunday, 1 for Monday, etc.)
  }

  addDays(date: Date, days: number): Date {
    // Ensure that 'date' is a valid Date object
    if (!(date instanceof Date)) {
      throw new Error('Invalid date parameter in addDays method.');
    }
  
    // Check if the date object is invalid or NaN
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date object in addDays method.');
    }
  
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  }
  
  override getFirstDayOfWeek(): number {
    // Adjust the value based on your locale (0 for Sunday, 1 for Monday, etc.)
    return 0;
  }


  override format(date: Date, displayFormat: Object): string {
    // Implement your custom date formatting logic here
    // You can utilize the displayFormat parameter to customize the output
    // Return the formatted date as a string
    return super.format(date, displayFormat);
  }

  override parse(value: any): Date | null {
    // Implement your custom date parsing logic here
    // Parse the value into a Date object or return null if parsing fails
    return super.parse(value);
  }

  
}


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL', // Display format in the input field
  },
  display: {
    dateInput: 'LL', // Display format in the input field
    monthYearLabel: 'MMM YYYY', // Display format for month and year in the calendar header
    dateA11yLabel: 'LL', // Accessibility label for the selected date
    monthYearA11yLabel: 'MMMM YYYY', // Accessibility label for the selected month and year
  },
};

@Component({
  selector: 'app-reservations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NavbarComponent,
    MatSidenavModule,
    SidebarComponent,
    CommonModule,
    FormsModule,
    CalendarModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter,
      deps: [MAT_DATE_FORMATS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
    {
      provide: CalendarUtils,
      useClass: CalendarUtils, // Add this provider
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_DATE_FORMATS],
    },
  ],
})
export class ReservationsComponent {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: { ...colors['red'] },
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: { ...colors['yellow'] },
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: { ...colors['blue'] },
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: { ...colors['yellow'] },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  
  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal) {
    
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
