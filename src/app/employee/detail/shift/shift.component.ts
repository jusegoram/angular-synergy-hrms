import { Component, OnInit, Input, SimpleChange, SimpleChanges, OnChanges } from '@angular/core';
import { Employee } from '../../Employee';
import { EmployeeService } from '../../services/employee.service';
import { FormGroup, FormBuilder } from '../../../../../node_modules/@angular/forms';
import { MatTableDataSource } from '../../../../../node_modules/@angular/material';

@Component({
  selector: 'shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css']
})
export class ShiftComponent implements OnInit, OnChanges {
  @Input() employee: any;
  @Input() authorization: boolean;

  dataSource: any = [];
  currentShift: any;
  shifts: any = [];
  today = Date.now();
  wpForm: FormGroup;
  displayedColumns = ['shiftName', 'startDate', 'endDate', 'createdDate'];
  constructor(private _employeeService: EmployeeService, private fb: FormBuilder) { }

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
    this._employeeService.saveShift(employeeShift).subscribe(result => {
    }, error => {});
  }
  populateTable(event: any) {
    if (this.dataSource.length !== 0) {
      const data = this.dataSource.data;
      data.push(event);
      this.dataSource.data = data;
    } else { this.dataSource = new MatTableDataSource(event); }
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
    if (typeof this.currentShift !== 'undefined') {
      const data = this.currentShift.data;
      data.push(event);
      this.currentShift.data = data;
    } else { this.currentShift = new MatTableDataSource(event); }
  }
}
