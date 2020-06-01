import { Component, OnInit } from '@angular/core';
import { Department, Position } from '@synergy-app/shared/models/positions-models';
import { AdminService } from '@synergy-app/core/services';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CreateDepartmentDialogComponent } from '../../components/create-department-dialog/create-department-dialog.component';
import { EditPositionDialogComponent } from '../../components/edit-position-dialog/edit-position-dialog.component';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
})
export class PositionComponent implements OnInit {
  displayedColumns: string[] = ['positionId', 'name', 'wage', 'action'];
  public departments: Department[];
  public currentDep: Department;
  dataSource: any;
  public newDep: string;
  public newPos: Position;

  public editDep: boolean;
  selectedDep: Department = null;

  constructor(private _admService: AdminService, private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.clearNewPosition();
  }

  ngOnInit() {
    this.loadDepartments();
  }
  onChange(event) {
    this.dataSource = new MatTableDataSource(event);
  }
  loadDepartments() {
    this.departments = [];
    this._admService.getDepartment().subscribe((results: Department[]) => {
      results.forEach(
        (result) => {
          this.departments.push(result);
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  deleteDepartment(department: Department) {
    const i = this.departments.indexOf(department);
    this._admService.deleteDepartment(department._id).subscribe(
      (result) => {
        this.departments.splice(i, 1);
        this.selectedDep = this.departments[i - 1];
        if (this.selectedDep) {
          this.onChange(this.selectedDep.positions);
        }
        this.openSuccess();
      },
      (error) => {
        console.error(error);
        this.openError();
      }
    );
  }

  editDepartment(department: Department) {
    this._admService.updateDepartment(department).subscribe(
      (result) => {
        this.editDep = false;
        this.openSuccess();
      },
      (error) => {
        console.error(error);
        this.openError();
      }
    );
  }

  openCreateDepartmentDialog() {
    const newDepartment = new Department('', '', '', []);
    const dialogRef = this.dialog.open(CreateDepartmentDialogComponent, {
      width: '500px',
      data: newDepartment,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.newDepartment(result);
    });
  }

  newDepartment(department: Department) {
    if (department.name !== '') {
      this._admService.createDepartment(department).subscribe(
        (result: Department) => {
          this.departments.push(result);
          this.selectedDep = result;
          this.onChange(this.selectedDep.positions);
        },
        (error) => {
          console.error(error);
          this.openError();
        }
      );
    } else {
      this.openError();
    }
  }

  editDepNameToggle() {
    this.editDep = true;
  }

  openEditPositionDialog(position) {
    let editPosition = null;
    editPosition = position;
    const dialogRef = this.dialog.open(EditPositionDialogComponent, {
      width: '500px',
      data: editPosition,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.editPosition(result);
    });
  }

  editPosition(position) {
    const positions: Position[] = [];
    positions.push(position);
    this._admService.updatePosition(positions).subscribe(
      (result) => {
        this.openSuccess();
      },
      (error) => {
        console.error(error);
        this.openError();
      }
    );
  }

  deletePosition(position) {
    const i = this.selectedDep.positions.indexOf(position);
    this._admService.deletePosition(position._id).subscribe(
      (result) => {
        this.selectedDep.positions.splice(i, 1);
        this.onChange(this.selectedDep.positions);
        this.openSuccess();
      },
      (error) => {
        this.openError();
      }
    );
  }
  newPosition(position) {
    const newPosition = new Position(
      '',
      position.positionId,
      position.name,
      position.baseWage
    );
    if (
      newPosition.name !== '' &&
      newPosition.positionId !== '' &&
      newPosition.baseWage !== null
    ) {
      this._admService
        .createPosition(newPosition, this.selectedDep._id)
        .subscribe(
          (data: Department) => {
            this._admService.clearDepartment();
            this.loadDepartments();
            this.openSuccess();
            this.clearNewPosition();
            this.selectedDep = data;
            this.onChange(this.selectedDep.positions);
          },
          (error) => {
            console.error(error);
            this.openError();
          }
        );
    } else {
      this.openError();
    }
  }
  clearNewPosition() {
    this.newPos = null;
    this.newPos = new Position('', '', '', null);
  }
  openSuccess() {
    this.openSnackBar('Great! Everything was done correctly', 'Ok');
  }
  openError() {
    this.openSnackBar('Opps! Something went wrong', 'Notify Synergy Admin');
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
