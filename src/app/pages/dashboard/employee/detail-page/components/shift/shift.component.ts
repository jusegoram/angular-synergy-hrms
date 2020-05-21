import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import moment from 'moment';
import { MinutesHoursPipe } from '@synergy-app/shared/pipes/minutes-hours.pipe';
import { TIME_VALUES } from '@synergy/environments/enviroment.common';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss'],
})
export class ShiftComponent implements OnInit {
  @Input() authorization: any;
  @Input() set employee(value) {
    this.populateTable(value.shift);
    this._employee = value;
  }
  @Input() set shifts(value) {
    if (value) {
      this.populateTable(value);
    }
  }
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  @Output() onResearchButtonClicked = new EventEmitter<any>();
  @Output() onSaveButtonClicked = new EventEmitter<any>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  _employee: any;
  onFirstLoad = { previousPageIndex: 0, pageIndex: 0, pageSize: 7 };
  dayMap = TIME_VALUES.WEEK_NAMES;
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

  constructor(private fb: FormBuilder, private sb: MatSnackBar, private timeString: MinutesHoursPipe) {
    this.buildForm(this.startOfWeek, this.endOfWeek);
  }

  ngOnInit() {}

  buildForm(start, end) {
    this.searchForm = this.fb.group({
      fromDate: [start.toDate(), Validators.required],
      toDate: [end.toDate(), Validators.required],
    });
  }
  populateTable(shift) {
    shift.map((obj) => {
      obj.readOnly = false;
      obj.shiftStartTime = this.timeString.transform(obj.shiftStartTime);
      obj.shiftEndTime = this.timeString.transform(obj.shiftEndTime);
      obj.shiftScheduledBreakAndLunch = this.timeString.transform(obj.shiftScheduledBreakAndLunch);
      return obj;
    });
    this.dataSource = new MatTableDataSource(shift);
    this.dataSource.paginator = this.paginator;
    this.onPageChange(this.onFirstLoad);
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day === TIME_VALUES.WEEK.MONDAY || day === TIME_VALUES.WEEK.TUESDAY || day === TIME_VALUES.WEEK.SUNDAY;
  }

  onEdit(item) {
    item.readonly = !item.readonly;
  }

  onSave(item) {
    const start = this.timeToMinutes(item.shiftStartTime);
    const end = this.timeToMinutes(item.shiftEndTime);
    const breakLunch = this.timeToMinutes(item.shiftScheduledBreakAndLunch);
    item.shiftScheduledHours = this.timeDiff(start, end);
    item.shiftScheduledHours === 0 || item.shiftScheduledHours === undefined
      ? (item.onShift = false)
      : (item.onShift = true);
    try {
      if (moment(item.date).isBefore(moment(), 'day')) {
        throw new Error('Woops! An Error ocurred: You can\'t modify the shift of a day in the past');
      }
      if (start === 0 && end === 0) {
        item.shiftScheduledBreakAndLunch = 0;
      }
      const q = { ...item };
      q.shiftStartTime = start;
      q.shiftEndTime = end;
      q.shiftScheduledBreakAndLunch = breakLunch;
      this.onSaveButtonClicked.emit({
        employee: this._employee,
        shift: q,
      });
    } catch (e) {
      this.onSearch(this.startOfWeek, this.endOfWeek);
      this.openSB(e.message);
    } finally {
      item.readonly = !item.readonly;
      this.onPageChange(this.onFirstLoad);
    }
  }

  onSearch(fromDate, toDate) {
    this.onResearchButtonClicked.emit({
      employee: this._employee,
      fromDate,
      toDate,
    });
  }

  onPageChange(e) {
    if (this.dataSource.data.length > 0) {
      const currentDSIndex = e.pageIndex * e.pageSize;
      const currentPage = [];
      const mapForTotal = (item, field) => {
        return item.map((i) => (i && i[field]) || 0);
      };
      const reduceForTotal = (item, field) => {
        return item.reduce((p, c) => p + ((c && c[field]) || 0), 0);
      };
      for (let i = 0; i < e.pageSize; i++) {
        currentPage.push(this.dataSource.data[currentDSIndex + i]);
      }
      this.totalSched = reduceForTotal(currentPage, 'shiftScheduledHours');
      this.totalReal = this.calculateTotalHours(mapForTotal(currentPage, 'systemHours'));
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
      const time = totaled.hh * TIME_VALUES.SECONDS_PER_HOUR + totaled.mm * TIME_VALUES.SECONDS_PER_MINUTE + totaled.ss;
      const hrs = ~~(time / TIME_VALUES.SECONDS_PER_HOUR);
      const mins = ~~((time % TIME_VALUES.SECONDS_PER_HOUR) / TIME_VALUES.SECONDS_PER_MINUTE);
      const secs = ~~time % TIME_VALUES.SEXAGESIMAL_BASE;
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
        value: time / TIME_VALUES.SECONDS_PER_HOUR,
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

  timeDiff(startTime: number, endTime: number) {
    if (startTime !== null && startTime !== undefined && endTime !== null && endTime !== undefined) {
      if (startTime < endTime) {
        return endTime - startTime;
      }
      if (startTime > endTime) {
        return TIME_VALUES.MINUTES_PER_DAY - startTime + endTime;
      }
    } else {
      return 0;
    }
  }

  timeToMinutes(time: string): number {
    if (time === '') {
      return 0;
    }
    if (time === '00:00') {
      return 24 * 60;
    }
    const splitted = time.split(':'),
      hours = parseInt(splitted[0], 10) * 60,
      minutes = hours + parseInt(splitted[1], 10);
    return minutes;
  }

  setBreakLunch(row, e: string, hhmm) {
    e = e.toString();
    if (e.length >= 2) {
      e = e.slice(0, 2);
    }
    if (e.length === 1) {
      e = '0' + e;
    }
    const { shiftScheduledBreakAndLunch } = row;
    const [hh, mm] = shiftScheduledBreakAndLunch.split(':');
    return hhmm === 'hh'
      ? (row.shiftScheduledBreakAndLunch = e + ':' + mm)
      : (row.shiftScheduledBreakAndLunch = hh + ':' + e);
  }

  openSB(message) {
    this.sb.open(message, 'Thank you!', { duration: 10000 });
  }
}
