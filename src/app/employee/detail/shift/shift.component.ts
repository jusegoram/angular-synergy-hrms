import { Component, OnInit, Input } from '@angular/core';
import { Employee } from '../../Employee';
import { EmployeeService } from '../../services/employee.service';
import { FormGroup, FormBuilder } from '../../../../../node_modules/@angular/forms';
import { MatTableDataSource } from '../../../../../node_modules/@angular/material';

@Component({
  selector: 'shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css']
})
export class ShiftComponent implements OnInit {
  @Input() employee: Employee;
  @Input() authorization: boolean;

  dataSource: any = [];
  currentShift: any;
  shifts: any = [];
  today = Date.now();
  wpForm: FormGroup;
  displayedColumns = ['shiftName', 'startDate', 'endDate', 'createdDate'];
  constructor(private _employeeService: EmployeeService, private fb: FormBuilder) { }

  ngOnInit() {
    this._employeeService.getShift().subscribe(result => { this.shifts = result; });
    this.populateTable(this.employee.shift);
    const employeeShifts: any = this.employee.shift;
    const employeeShift: any[] = employeeShifts[employeeShifts.length - 1].shift;
    this.populateTable1(employeeShift);
    this.buildForm();
  }
  buildForm() {
    this.wpForm = this.fb.group({
      shift: [],
      createdDate: [],
    });
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
    console.log('working');
    this._employeeService.saveShift(employeeShift).subscribe(result => {
      console.log(result);
    }, error => {});
  }
  populateTable(event: any) {
    console.log(this.dataSource);
    if (this.dataSource.length !== 0) {
      const data = this.dataSource.data;
      data.push(event);
      this.dataSource.data = data;
    } else { this.dataSource = new MatTableDataSource(event); }
  }

  populateTable1(event: any[]) {
    if (typeof this.currentShift !== 'undefined') {
      const data = this.currentShift.data;
      data.push(event);
      this.currentShift.data = data;
    } else { this.currentShift = new MatTableDataSource(event); }
    console.log(this.currentShift);
  }
}
