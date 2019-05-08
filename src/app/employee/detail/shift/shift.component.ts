import { Component, OnInit, Input, SimpleChange, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import { FormGroup, FormBuilder } from '../../../../../node_modules/@angular/forms';
import { MatTableDataSource, MatSnackBar, MatPaginator } from '../../../../../node_modules/@angular/material';

@Component({
  selector: 'shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css']
})
export class ShiftComponent implements OnInit, OnChanges {
  @Input() employee: any;
  @Input() authorization: any;

  dataSource: any = [];
  currentShift: any;
  shifts: any = [];
  today = Date.now();
  wpForm: FormGroup;
  displayedColumns = ['shiftName', 'startDate', 'endDate', 'createdDate'];
  constructor(private _employeeService: EmployeeService, private fb: FormBuilder, private snackbar: MatSnackBar) { }

  ngOnChanges(changes: SimpleChanges): void {
    const employee: SimpleChange = changes.employee;
    if (employee.currentValue.shift.length !== 0) {
    this.populateTable(employee.currentValue.shift);
    const employeeShifts: any = employee.currentValue.shift;
    const employeeShift: any[] = employeeShifts[employeeShifts.length - 1].shift;
    const shift = employeeShift.shift;
    this.populateTable1(shift);
    }
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this._employeeService.getShift().subscribe(result => { this.shifts = result; });
    this.buildForm();
  }
  buildForm() {
    this.wpForm = this.fb.group({
      shift: [],
      createdDate: [],
    });
  }

  getNextDate(param: number): Date {
    const day = param + 1;
    const d = new Date();
    d.setDate(d.getDate() + (day + 7 - d.getDay()) % 7);
    return d;
  }

  compareDate(date: Date): boolean{
    const datenow = new Date();
    if(datenow.getDay() === date.getDay()) return true;
    else return false;
  }
  getDayName(param: number): string {
    let name = 'Monday';
    switch (param) {
      case 1: name = 'Tuesday';
      break;
      case 2: name = 'Wednesday';
      break;
      case 3: name = 'Thursday';
      break;
      case 4: name = 'Friday';
      break;
      case 5: name = 'Saturday';
      break;
      case 6: name = 'Sunday';
      break;
      default: name = name;
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
    const employeeShift = {
      _id: '',
      employeeId: this.employee.employeeId,
      employee: this.employee._id,
      createdDate: new Date(),
      startDate: this.wpForm.value.createdDate,
      endDate: null,
      shift: this.wpForm.value.shift
    };
    this._employeeService.saveShift(employeeShift).subscribe((result: any) => {
      let wp = this.shifts.filter(item => item._id === result.shift);
      result.shift = wp[0];
      this.populateTable(result);
      this.populateTable1(result.shift.shift);
      this.openSuccess();
    }, error => {
      this.openError()
    });
  }
  populateTable(event: any) {
    if (this.dataSource.length !== 0) {
      const data = this.dataSource.data;
      data.push(event);
      this.dataSource.data = data;
    } else {
      this.dataSource = new MatTableDataSource(event);
      this.dataSource.paginator = this.paginator;}
  }
  transformTime(param): string {
    let result = 'N/A';
        if (param !== null) {
        const stored = parseInt(param, 10);
        const hours = Math.floor(stored / 60);
        const minutes = stored - ( hours * 60 );
        const fixedMin = (minutes === 0) ? '00' : minutes;
        result = hours + ':' + fixedMin;
        }
        return result;
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
      duration: 5000,
      });
    }
}
