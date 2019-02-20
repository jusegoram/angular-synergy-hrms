import { Component, OnInit, Input } from '@angular/core';
import { EmployeePosition } from '../../Employee';
import { EmployeeService } from '../../employee.service';
import { MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import { Department, Client } from '../../../administration/employee/models/positions-models';
import { FormBuilder, FormGroup } from '@angular/forms';



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
  public position: any;
  public employeePosition: any;
  public departments: Department[];
  public clients: Client[];
  positionForm: FormGroup;
  displayedColumns = ['client', 'department', 'position', 'positionId', 'startDate', 'endDate'];
  constructor(private fb: FormBuilder, public snackBar: MatSnackBar, public dialog: MatDialog, private employeeService: EmployeeService) { }
  ngOnInit() {
    this.employeeService.getClient().subscribe(data => this.clients = data);
    this.employeeService.getDepartment().subscribe(data => this.departments = data);
    this.employeePositions = this.employee.position;
    this.populateTable(this.employeePositions);
    this.positionForm = this.fb.group({
      client: [''],
      department: [''],
      position: [''],
      start: [''],
      end: [''],
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onAdd() {
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
        this.populateTable(data);
        this.fixDate(data.startDate);
      }, error => {
        this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
          duration: 2000,
        });
        return error;
      });
    this.clearForm();
  }

  // FIXME: employee positions giving errors;
  fixDate(arg: Date) {
    const data = this.dataSource.data;
    if (data[0]) {
      const i = data.length - 2;
      data[i].endDate = arg;
      this.employeeService.updatePosition(data[i]).subscribe(res => {
        this.dataSource.data = data;
      });
    }
  }
// TODO: determine wether to deprecate or fix
  sendRequest() {

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
  populateTable(event: any) {
    if (this.dataSource) {
      const data = this.dataSource.data;
      data.push(event);
      this.dataSource.data = data;
    } else { this.dataSource = new MatTableDataSource(event); }
  }
  setPositions(event: any) {
    this.positions = event;
  }
}
