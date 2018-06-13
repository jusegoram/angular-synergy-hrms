import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { EmployeePosition } from '../../Employee';
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import { Department, Client } from '../../../administration/employee/models/positions-models';
import {FormBuilder, FormGroup} from '@angular/forms';
import { noop } from 'rxjs';



@Component({
  selector: 'position-info',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {
  userId: string;
  @Input() employee: any;
  @Input() authorization: boolean;
// positions = [
//   { id: '1001', name: 'ED 1' },
//   { id: '1002', name: 'Rep 2: A' },
//   { id: '1003', name: 'Rep 3: Silver' },
//   { id: '1004', name: 'Rep 4: Gold' },
//   { id: '1005', name: 'Rep 5: Platinum' },
//   { id: '1006', name: 'Rep 6: Emerald' },
//   { id: '1007', name: 'Rep 7: ' },
//   { id: '1008', name: 'Rep 8' },
//   { id: '1009', name: 'Cleaner I' },
//   { id: '1010', name: 'Security' },
//   { id: '1011', name: 'Trainee' },
//   { id: '1002', name: 'ED 1 - old' },
//   { id: '1002', name: 'Rep 2: A - old' },
//   { id: '1003', name: 'Rep 3: Silver - old' },
//   { id: '1004', name: 'Rep 4: Gold - old' },
//   { id: '1005', name: 'Rep 5: Platinum - old' },
//   { id: '1006', name: 'Rep 6: Emerald - old' },
//   { id: '1007', name: 'Rep 7:  - old' },
//   { id: '1008', name: 'Rep 8 - old' },
//   { id: '1122', name: 'Cleaner I - old' },
//   { id: '1010', name: 'Security - old' },
//   { id: '1011', name: 'Trainee - old' }];
  public dataSource: any;
  public employeePositions: EmployeePosition[];
  public positions: any;
  public employeePosition: any;
  public departments: Department[];
  public clients: Client[];
  positionForm: FormGroup;
  displayedColumns = ['positionid', 'position', 'startDate', 'endDate'];
  constructor(private fb: FormBuilder, public snackBar: MatSnackBar, public dialog: MatDialog, private employeeService: EmployeeService) { }
ngOnInit() {
  this.employeeService.getClient().subscribe(data => this.clients = data);
    this.employeeService.getDepartment().subscribe(data => { this.departments = data; console.log(data); });
    this.employeePositions = this.employee.position;
    this.populateTable();
    this.positionForm = this.fb.group({
      client: [''],
      department: [''],
      position: [''],
      start: [''],
      end: [''],
    });
}

  // ngOnChanges(changes: SimpleChanges): void {
  //   if ( this.employeeId !== ' ' && changes['employeeId']) {
  //     this.employeeService.getPositions(this.employeeId).subscribe(
  //       (employeePosition: EmployeePosition[] ) => {
  //         this.currentPositions = employeePosition;
  //         this.dataSource = new MatTableDataSource(this.currentPositions);
  //         this.departments = this.employeeService.departments;
  //     });
  //   }
  // }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onAdd() {
  //   const selectedPosition = this.positions.find((result) => result.name === this.position );
  //   const currentDate = new Date();
  //   if (this.start <= currentDate && !this.end) {
  //     const newpos = new EmployeePosition('new', this.employeeId, this.userId, selectedPosition.positionid, selectedPosition.name, this.start, this.end);
  //     // fix end date
  //     this.fixEndDate();
  //     this.currentPositions.push(newpos);
  //     this.sendRequest();
  //     this.dataSource = new MatTableDataSource(this.currentPositions);
  //     this.emptyForm();
  //   } else if (this.end <= currentDate && this.start < this.end) {
  //     const newpos = new EmployeePosition('new', this.employeeId, this.userId, selectedPosition.positionid, selectedPosition.name, this.start, this.end);
  //     const i = this.currentPositions.length;
  //     // fix end date
  //     this.fixEndDate();
  //     this.currentPositions.push(newpos);
  //     this.sendRequest();
  //   this.dataSource = new MatTableDataSource(this.currentPositions);
  //   this.emptyForm();
  //   }else{
  //     this.snackBar.open('Sorry, the dates have to be correct');
  //     this.emptyForm();
  //   }
  // }
  // fixEndDate() {
  //   if ( this.currentPositions ) {
  //   const i = this.currentPositions.length - 1;
  //     if (i >= 0 && this.currentPositions[i].endDate === undefined ||
  //         i >= 0 && this.currentPositions[i].endDate === null) {
  //       this.currentPositions[i].endDate = this.start;
  //     }
  //   }
    const newPosition = new EmployeePosition(
      '',
      this.employee.employeeId,
      this.positionForm.value.client,
      this.positionForm.value.department.name,
      this.employee._id,
      this.positionForm.value.position._id,
      this.positionForm.value.start,
      this.positionForm.value.end);
      this.employeeService.savePosition(newPosition)
      .subscribe((data: any) => {
        this.snackBar.open('Employee information updated successfully', 'thank you', {
          duration: 2000,
        });
        this.positions.push(data);
        this.searchPosDate(data.startDate);
      }, error => {
        this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
          duration: 2000,
        });
          return error;
      });
    console.log(newPosition);
    this.clearForm();
  }
  searchPosDate(arg: Date) {
    const i = this.positions.lenght() - 1;
    this.positions[i].endDate = arg;
  }
  sendRequest() {
    // const i = this.currentPositions.length;
    // const updatePosition = this.currentPositions[i - 2];
    // if (updatePosition) {
    // this.employeeService.updatePosition(updatePosition).subscribe(
    //   data => {},
    //   error => {});
    // }
    //
    // const savePosition = this.currentPositions[i - 1];
    // this.employeeService.savePosition(savePosition).subscribe(
    //   data => {
    //     this.employeeService.getPositions(this.employeeId).subscribe(
    //       (employeePosition: EmployeePosition[]) => {
    //       this.currentPositions = employeePosition;
    //       this.dataSource = new MatTableDataSource(this.currentPositions);
    //       this.snackBar.open('Save and reload completed successfully', 'Great!');
    //       });
    //  },
    //   error => {
    //     this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
    //       duration: 2000});
    //   });
  }
  clearForm() {
      this.positionForm.reset();
  }
  // onCheck() {
  //   const dialogRef = this.dialog.open(DialogComponent, {
  //     width: '250px',
  //     data: {}
  //   });
  //   let check;
  //   dialogRef.afterClosed().subscribe(result => {
  //     check = dialogRef.componentInstance.result;
  //     if (check) {
  //       const i = this.positions.length - 1;
  //       if (this.end && i >= 0 && this.positions[i].endDate ===  null) {
  //         this.employeePositions[i].endDate = this.end;
  //         this.dataSource = new MatTableDataSource(this.employeePositions);
  //         this.emptyForm();
  //       }
  //     }
  //
  //   });
  // }
 populateTable() {
    this.dataSource = new MatTableDataSource(this.positions);
 }
  setPositions(event: any) {
    this.positions = event;
  }
}
