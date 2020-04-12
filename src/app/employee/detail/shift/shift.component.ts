import { EmployeeService } from './../../employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss'],
})
export class ShiftComponent implements OnInit, OnChanges {
  @Input() employee: any;
  @Input() authorization: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  onFirstLoad = { previousPageIndex: 0, pageIndex: 0, pageSize: 7 };
  dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  items = ['PRESENT', 'LATE', 'ABSENT', 'ON LEAVE', 'ON VACATIONS', 'N/A'];
  startOfWeek = moment().startOf('week');
  endOfWeek = moment().endOf('week').add(1, 'day');
  searchForm: FormGroup;
  dataSource: MatTableDataSource<unknown[]>;
  tableColumns = [
    'day',
    'status',
    'attendance',
    'shift',
    'scheduledHours',
    'workedHours',
    'scheduledLunchBreak',
    'lunchBreak',
    'action',
  ];

  totalSched: any;
  totalReal: {
    hh: number;
    mm: number;
    ss: number;
    value: number;
    valueString: string;
  };
  totalSchedLB: any;
  totalRealL: {
    hh: number;
    mm: number;
    ss: number;
    value: number;
    valueString: string;
  };
  totalRealB: {
    hh: number;
    mm: number;
    ss: number;
    value: number;
    valueString: string;
  };
  constructor(private fb: FormBuilder, private _employeeService: EmployeeService, private sb: MatSnackBar) {
    this.buildForm(this.startOfWeek, this.endOfWeek);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const employee: SimpleChange = changes.employee;
    if (employee) {
      this.populateTable(employee.currentValue.shift);
    }
  }
  ngOnInit() {}

  buildForm(start, end) {
    this.searchForm = this.fb.group({
      fromDate: [start.toDate(), Validators.required],
      toDate: [end.toDate(), Validators.required],
    });
  }
  populateTable(shift) {
    shift.map((obj) => ({ ...obj, readonly: false }));
    this.dataSource = new MatTableDataSource(shift);
    this.dataSource.paginator = this.paginator;
    this.onPageChange(this.onFirstLoad);
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day === 0 || day === 1 || day === 6;
  }

  onEdit(item) {
    item.readonly = !item.readonly;
  }

  onSave(item) {
    item.shiftScheduledHours = this.calculateTimeDifference(item.shiftStartTime, item.shiftEndTime);
    if (item.shiftScheduledHours === 0 || item.shiftScheduledHours === undefined) {
      item.onShift = false;
    } else {
      item.onShift = true;
    }
    if (
      item.shiftStartTime === undefined ||
      item.shiftEndTime === undefined ||
      item.shiftScheduledHours > 720 ||
      item.shiftStartTime === item.shiftEndTime
    ) {
      this.openSB('Woops! An Error ocurred: Please check that the hours are in 24 Hour format(HH:MM)');
    } else {
      const shiftDate = moment(item.date),
        now = moment();
      // FIXME: CHANGE IS AFTER TO IS BEFORE.
      if (shiftDate.isBefore(now, 'day')) {
        this.openSB(`Woops! An Error ocurred: You can't modify the shift of a day in the past`);
      } else {
        if (item.shiftStartTime === 0 && item.shiftEndTime === 0) {
          item.shiftScheduledBreakAndLunch = 0;
        }
        this._employeeService.updateEmployeeShift(item).subscribe((result) => {
          if (result) {
            item.readonly = !item.readonly;
            this.onPageChange(this.onFirstLoad);
            this.openSB('Perfect! The shift was updated successfully: Please refresh to verify');
          }
        });
      }
    }
  }

  onSearch(fromDate, toDate) {
    this._employeeService.getEmployeeShift(this.employee.employeeId, fromDate, toDate).subscribe((result) => {
      this.populateTable(result);
    });
  }

  onPageChange(e) {
    if (this.dataSource.data.length > 0) {
      const currentDSIndex = e.pageIndex * e.pageSize;
      const currentPage = [];
      for (let i = 0; i < e.pageSize; i++) {
        currentPage.push(this.dataSource.data[currentDSIndex + i]);
      }
      this.totalSched = currentPage.reduce((p, c) => p + c.shiftScheduledHours, 0);
      this.totalReal = this.calculateTotalHours(currentPage.map((i) => i.systemHours));
      this.totalSchedLB = currentPage.reduce((p, c) => p + c.shiftScheduledBreakAndLunch, 0);
      this.totalRealL = this.calculateTotalHours(currentPage.map((i) => i.lunchHours));
      this.totalRealB = this.calculateTotalHours(currentPage.map((i) => i.breakHours));
    }
  }
  calculateTotalHours(arr: any[]) {
    if (arr.length > 0) {
      const totaled: any = {
        hh: Number,
        mm: Number,
        ss: Number,
      };
      totaled.hh = arr.reduce((p, c) => p + c.hh, 0);
      totaled.mm = arr.reduce((p, c) => p + c.mm, 0);
      totaled.ss = arr.reduce((p, c) => p + c.ss, 0);
      const time = totaled.hh * 3600 + totaled.mm * 60 + totaled.ss;
      const hrs = ~~(time / 3600);
      const mins = ~~((time % 3600) / 60);
      const secs = ~~time % 60;
      let ret = '';

      if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
      }

      ret += '' + mins + ':' + (secs < 10 ? '0' : '');
      ret += '' + secs;
      const correctedTotal = {
        hh: hrs,
        mm: mins,
        ss: secs,
        value: time / 3600,
        valueString: ret,
      };
      return correctedTotal;
    } else {
      const finished = {
        hh: 0,
        mm: 0,
        ss: 0,
        value: 0,
        valueString: '00:00:00',
      };
      return finished;
    }
  }

  calculateTimeDifference(startTime, endTime) {
    if (startTime !== null && startTime !== undefined && endTime !== null && endTime !== undefined) {
      if (startTime < endTime) {
        return endTime - startTime;
      }
      if (startTime > endTime) {
        return 1440 - startTime + endTime;
      }
    } else {
      return 0;
    }
  }
  timeToMinutes(time: string) {
    if (time.includes(':') && time.length >= 4) {
      const splitted = time.split(':'),
        hours = parseInt(splitted[0], 10) * 60,
        minutes = hours + parseInt(splitted[1], 10);
      if (splitted[1].length > 1) {
        return minutes;
      }
    } else {
      if (time.length > 5) {
        this.openSB(`Woops! An Error ocurred:
        One of the time fields has an error,
        please check that the time format is in 24h(24:00) Format.`);
      }
      return 0;
    }
  }
  openSB(message) {
    this.sb.open(message, 'Thank you!', { duration: 10000 });
  }
}
