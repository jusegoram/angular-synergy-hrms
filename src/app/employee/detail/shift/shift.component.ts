import {
  Component,
  OnInit,
  Input,
  SimpleChange,
  SimpleChanges,
  OnChanges,
  ViewChild
} from '@angular/core';
import { EmployeeService } from '../../employee.service';
import {
  FormGroup,
  FormBuilder
} from '../../../../../node_modules/@angular/forms';
import {
  MatTableDataSource,
  MatSnackBar,
  MatPaginator
} from '../../../../../node_modules/@angular/material';

@Component({
  selector: 'shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css']
})
export class ShiftComponent implements OnInit, OnChanges {
  @Input() employee: any;
  @Input() authorization: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  dataSource: any = [];
  currentShift: any;
  shifts: any = [];
  today = Date.now();
  wpForm: FormGroup;
  displayedColumns = ['shiftName', 'startDate', 'endDate', 'createdDate'];
  weekStart: Date;
  weekEnd: Date;
  constructor(
    private _employeeService: EmployeeService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const employee: SimpleChange = changes.employee;
    if (employee.currentValue.shift.length !== 0) {
      this.populateTable(employee.currentValue.shift);
      const employeeShifts: any = employee.currentValue.shift;
      const employeeShift: any[] =
        employeeShifts[employeeShifts.length - 1].shift;
      const shift = employeeShift.shift;
      this.populateTable1(shift);
    }
  }

  ngOnInit() {
    this._employeeService.getShift().subscribe(result => {
      this.shifts = result;
    });
    this.addActionColumn();
    this.buildForm();
    [this.weekStart, this.weekEnd] = this.getWeekDates();
  }
  addActionColumn() {
    if (this.authorization.role === 9999) {
      this.displayedColumns.push('action');
    }
  }
  buildForm() {
    this.wpForm = this.fb.group({
      shift: [],
      createdDate: []
    });
  }

  getNextDate(param: number): Date {
    const day = param + 1;
    const d = new Date();
    d.setDate(d.getDate() );
    return d;
  }

  compareDate(date: Date): boolean {
    const datenow = new Date();
    if (datenow.getDay() === date.getDay()) return true;
    else return false;
  }
  getDayName(param: number): string {
    let name = 'Monday';
    switch (param) {
      case 1:
        name = 'Tuesday';
        break;
      case 2:
        name = 'Wednesday';
        break;
      case 3:
        name = 'Thursday';
        break;
      case 4:
        name = 'Friday';
        break;
      case 5:
        name = 'Saturday';
        break;
      case 6:
        name = 'Sunday';
        break;
      default:
        name = name;
        break;
    }
    return name;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  onSave() {
    const shift = JSON.parse(JSON.stringify(this.wpForm.value.shift));
    shift.shiftId = shift._id;
    delete shift._id;

    const employeeShift = {
      employeeId: this.employee.employeeId,
      employee: this.employee._id,
      createdDate: new Date(),
      startDate: this.wpForm.value.createdDate,
      endDate: null,
      shift: shift,
      current:
        this.wpForm.value.createdDate >
        new Date(
          this.dataSource &&
          this.dataSource.data &&
          this.dataSource.data.length > 0
            ? this.dataSource.data[0].startDate
            : '12/12/2999'
        ),
      first: !this.dataSource.data
    };

    this._employeeService.saveShift(employeeShift).subscribe(
      (result: any) => {
        const wp = this.shifts.filter(
          item => item._id === result.shift.shiftId
        );
        result.shift = wp[0];
        this.populateTable(result);
        if (employeeShift.current || employeeShift.first) {
          this.populateTable1(result.shift.shift);
        }
        this.openSuccess();
      },
      error => {
        this.openError();
      }
    );
  }
  populateTable(event: any) {
    if (
      this.dataSource &&
      this.dataSource.data &&
      this.dataSource.data.length >= 0
    ) {
      const data = this.dataSource.data;
      data.unshift(event);
      this.dataSource.data = data;
    } else {
      this.dataSource = new MatTableDataSource(event);
      this.dataSource.paginator = this.paginator;
    }
  }
  transformTime(param): string {
    let result = '00:00';
    if (param !== null) {
      const stored = parseInt(param, 10);
      const hours = Math.floor(stored / 60);
      const minutes = stored - hours * 60;
      const fixedMin = minutes === 0 ? '00' : minutes;
      result = hours + ':' + fixedMin;
      return result;
    } else return result;
  }
  populateTable1(event: any) {
    event.forEach(element => {
      element.nextDate = this.getNextDate(element.day);
      element.dayName = this.getDayName(element.day);
      element.startTimeString = this.transformTime(element.startTime);
      element.endTimeString = this.transformTime(element.endTime);
    });
    this.currentShift = new MatTableDataSource(event);
  }
  openSuccess() {
    this.openSnackBar('Great! Everything was done correctly', 'Ok');
  }
  openError() {
    this.openSnackBar('Opps! Something went wrong', 'Notify Synergy Admin');
  }
  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 5000
    });
  }

  deleteShift(shift: object) {
    this._employeeService.deleteShift(shift).subscribe(
      (result: any) => {
        this.dataSource = undefined;
        this.populateTable(result.shift);
        this.snackbar.open(
          'Employee information updated successfully',
          'thank you',
          {
            duration: 2000
          }
        );
      },
      error => {
        this.snackbar.open(
          'Error updating information, please try again or notify the IT department',
          'Try again',
          {
            duration: 2000
          }
        );
      }
    );
  }
  getWeekDates() {
    const now = new Date();
    const dayOfWeek = now.getDay(); //0-6
    const numDay = now.getDate();

    const start = new Date(now); //copy
    start.setDate(numDay - dayOfWeek);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now); //copy
    end.setDate(numDay + (7 - dayOfWeek));
    end.setHours(0, 0, 0, 0);

    return [start, end];
  }
}
