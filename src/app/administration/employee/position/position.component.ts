import { Component, OnInit } from '@angular/core';
import { Department, Position } from '../models/positions-models';
import { AdminService } from '../../services/admin.services';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {
  displayedColumns: string[] = ['positionId', 'name', 'wage', 'action'];
  public departments: Department[];
  public currentDep: Department;

  public newDep: string;
  public newPos: Position;

  selectedDep: Department;

  constructor(private _admService: AdminService, private snackBar: MatSnackBar) {
    this.newPos = new Position('', '', '', null);

  }

  ngOnInit() {
    this.departments = [];
    this._admService.getDepartment().subscribe((results: Department[]) => {
      results.forEach(result => {
        this.departments.push(result);
      });
    });
  }
  getSelectedDep(): Department {
    let found: Department;
    const name = this.selectedDep;
    found = this.departments.find(result => {
      return result.name === name;
    });
    this.currentDep = found;
    this.newDep = this.currentDep.name;
    return found;
  }
  onAddDep() {

    const i = this.departments.findIndex(result => {
      return result.name === this.newDep;
    });
    if (i >= 0) {
    this.currentDep.positions.push(this.newPos);
      if (this.departments[i]._id !== '') {
        this.departments[i].state = 'newPosition';
      } else {
        this.departments[i].state = 'new';
      }

      this.departments[i].positions = this.currentDep.positions;

    this.newPos = new Position('', '', '', null);
    }else {
      const submitted = new Department('new', '', this.newDep, []);
      submitted.positions.push(this.newPos);
      this.departments.push(submitted);
      this.newPos = new Position('', '', '', null);
    }
  }
  onChangesDep() {
    const i = this.departments.findIndex(result => {
      return result.name === this.newDep;
    });
    if (this.departments[i]._id === '') {
      this.departments[i].state = 'new';
    } else if ( this.departments[i].state !== 'modified' ) {
      this.departments[i].state = 'modified';
    }

  }

  onSaveDep() {
    for (let i = 0; i < this.departments.length; i++ ) {
      if (this.departments[i].state === 'new') {
        // save admService
        this._admService.saveDepartment(this.departments[i])
        .subscribe(result => {
          this.departments[i].state = 'saved';
        });
      }else if (this.departments[i].state === 'newPosition') {
        this._admService.savePosition(this.departments[i]).subscribe(
          data => {
            this.snackBar.open('Position information updated successfully', 'thank you', {
              duration: 2000,
            });
            this.departments[i].state = 'saved';
          },
          error => {
            this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
              duration: 2000,
            });
          }
        );
      }else if (this.departments[i].state === 'modified') {
        this._admService.updateDepartment(this.departments[i]).subscribe(
          data => {
            this.snackBar.open('Departments information updated successfully', 'thank you', {
              duration: 2000,
            });
            this.departments[i].state = 'saved';
          },
          error => {
            this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
              duration: 2000,
            });
          }
        );
      }
    }
  }
}
