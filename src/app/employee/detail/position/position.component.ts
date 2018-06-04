import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { EmployeePosition } from '../../services/models/employee-models';
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import {ActivatedRoute, Params} from '@angular/router';
import { Department } from '../../../administration/employee/models/positions-models';



@Component({
  selector: 'position-info',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnChanges {
  userId: string;
  @Input() employeeId: string;
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
  public positions: any[];
  public position: any;
  public start: Date;
  public end: Date;
  public departments: Department[];

  currentPositions: EmployeePosition[];
  displayedColumns = ['positionid', 'position', 'startDate', 'endDate'];
  constructor(private employeeService: EmployeeService, public snackBar: MatSnackBar,
              public dialog: MatDialog,
              private activatedRoute: ActivatedRoute ) {
                this.activatedRoute.queryParams.subscribe((params: Params) => {
                  this.userId = params['id'];
                });
               }


  ngOnChanges(changes: SimpleChanges): void {
    if ( this.employeeId !== ' ' && changes['employeeId']) {
      this.employeeService.getPositions(this.employeeId).subscribe(
        (employeePosition: EmployeePosition[] ) => {
          this.currentPositions = employeePosition;
          this.dataSource = new MatTableDataSource(this.currentPositions);
          this.departments = this.employeeService.departments;
      });
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onAdd() {
    const selectedPosition = this.positions.find((result) => result.name === this.position );
    const currentDate = new Date();
    if (this.start <= currentDate && !this.end) {
      const newpos = new EmployeePosition('new', this.employeeId, this.userId, selectedPosition.positionid, selectedPosition.name, this.start, this.end);
      // fix end date
      this.fixEndDate();
      this.currentPositions.push(newpos);
      this.sendRequest();
      this.dataSource = new MatTableDataSource(this.currentPositions);
      this.emptyForm();
    } else if (this.end <= currentDate && this.start < this.end) {
      const newpos = new EmployeePosition('new', this.employeeId, this.userId, selectedPosition.positionid, selectedPosition.name, this.start, this.end);
      const i = this.currentPositions.length;
      // fix end date
      this.fixEndDate();
      this.currentPositions.push(newpos);
      this.sendRequest();
    this.dataSource = new MatTableDataSource(this.currentPositions);
    this.emptyForm();
    }else{
      this.snackBar.open('Sorry, the dates have to be correct');
      this.emptyForm();
    }
  }
  fixEndDate() {
    if ( this.currentPositions ) {
    const i = this.currentPositions.length - 1;
      if (i >= 0 && this.currentPositions[i].endDate === undefined ||
          i >= 0 && this.currentPositions[i].endDate === null) {
        this.currentPositions[i].endDate = this.start;
      }
    }
  }

  sendRequest() {
    const i = this.currentPositions.length;
    const updatePosition = this.currentPositions[i - 2];
    if (updatePosition) {
    this.employeeService.updatePosition(updatePosition).subscribe(
      data => {},
      error => {});
    }

    const savePosition = this.currentPositions[i - 1];
    this.employeeService.savePosition(savePosition).subscribe(
      data => {
        this.employeeService.getPositions(this.employeeId).subscribe(
          (employeePosition: EmployeePosition[]) => {
          this.currentPositions = employeePosition;
          this.dataSource = new MatTableDataSource(this.currentPositions);
          this.snackBar.open('Save and reload completed successfully', 'Great!');
          });
     },
      error => {
        this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
          duration: 2000});
      });
  }
  emptyForm(){
    this.start = null;
    this.end = null;
  }
  onCheck(){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {}
    });
    let check;
    dialogRef.afterClosed().subscribe(result => {
      check = dialogRef.componentInstance.result;
      if (check) {
        const i = this.currentPositions.length - 1;
        if (this.end && i >= 0 && this.currentPositions[i].endDate ===  null) {
          this.currentPositions[i].endDate = this.end;
          this.dataSource = new MatTableDataSource(this.currentPositions);
          this.emptyForm();
        }
      }

    });
  }

  setPositions(id: string){
    const i = this.departments.findIndex((result) => result.id === id);
    this.positions = this.departments[i].positions;
  }
}
