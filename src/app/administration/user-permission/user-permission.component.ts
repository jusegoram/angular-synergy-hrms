import { SessionService } from './../../session/services/session.service';
import { User } from '../../session/User';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, TooltipComponent } from '@angular/material';
import { AdminService } from '../services/admin.services';
import {Observable} from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {
  myForm: FormGroup;
  employeeCtrl= new FormControl();
  employees: object[];
  selectedEmployee: object;
  selectedValue = 0;
  filteredEmployees: Observable<object[]>;
  items = [
    {value: 0, viewValue: 'Accountant'},
    {value: 1, viewValue: 'Manager'},
    {value: 2, viewValue: 'Super Manager'},
    {value: 3, viewValue: 'Administrator'},
    {value: 4, viewValue: 'Super Administrator'}
  ];
      constructor(
        private sessionService: SessionService,
        private adminService: AdminService,
        private router: Router,
        private snackBar: MatSnackBar) {

      }
     _filterEmployees(value: string): object[] {
        const filterValue = value.toString().toLowerCase();
        return this.employees.filter(employee => employee['firstName'].toLowerCase().includes(filterValue));
      }
    onSubmit() {
          const log: object = {date: new Date(), log: 'User Creation'};
          console.log(log);
          console.log(typeof log);
          const user = new User(
              this.myForm.value.username,
              this.myForm.value.password,
              this.myForm.value.role,
              this.myForm.value.firstName,
              this.myForm.value.middleName,
              this.myForm.value.lastName,
              new Date(),
              this.getEmployee()['_id'], // Employee _id
              log
          );
          this.sessionService.signup(user)
              .subscribe(
                  data => {
                    this.snackBar.open('User was created succesfully', 'thank you', {
                      duration: 2000,
                    });
                  },
                  error => {
                    this.snackBar.open('There was an error creating the user, please contact the IT department', 'OK', {
                      duration: 2000,
                    });
                  }
              );
          this.myForm.reset();
          this.router.navigateByUrl('/admin/permissions');
      }
      setEmployee(employee: object) {
        this.selectedEmployee = employee;
      }
      getEmployee(): object {
        console.log(this.selectedEmployee);
        return this.selectedEmployee;
      }
      ngOnInit() {
        this.adminService.getEmployees().subscribe((data) => {
          this.employees = data;
        });
          this.myForm = new FormGroup({
              firstName: new FormControl(null, Validators.required),
              middleName: new FormControl(null, Validators.required),
              lastName: new FormControl(null, Validators.required),
              role: new FormControl(null, Validators.required),
              username: new FormControl(null, Validators.required),
              password: new FormControl(null, Validators.required),
          });
          this.employeeCtrl.setValidators(Validators.required);
          this.filteredEmployees = this.employeeCtrl.valueChanges
          .pipe(
            startWith(''),
            map(value => {
              return this.employees ? this._filterEmployees(value) : this.employees;
             })
          );
      }
}
