import { SessionService } from './../../session/services/session.service';
import { User } from '../../session/User';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, TooltipComponent, MatTableDataSource } from '@angular/material';
import { AdminService } from '../services/admin.services';
import {Observable} from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Employee } from '../../employee/Employee';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {
  myForm: FormGroup;
  employeeCtrl= new FormControl();
  employees: any[];
  employeesMap: any[];
  selectedEmployee: Employee;
  selectedValue = 0;
  filteredEmployees: Observable<Employee[]>;
  dataSource = new MatTableDataSource();
  items = [
    {value: 0, viewValue: 'Accountant'},
    {value: 1, viewValue: 'Manager'},
    {value: 2, viewValue: 'Super Manager'},
    {value: 3, viewValue: 'Administrator'},
    {value: 4, viewValue: 'Super Administrator'}
  ];
  displayedColumns = ['employeeID', 'name', 'status', 'rights','details'];
      constructor(
        private sessionService: SessionService,
        private adminService: AdminService,
        private router: Router,
        private snackBar: MatSnackBar) {
      }
     _filterEmployees(value: string): Employee[] {
        const filterValue = value.toString().toLowerCase();
        return this.employees.filter(
          employee => {
            return employee['fullSearchName']
                    .toLowerCase()
                    .includes(filterValue);
          });
      }
    reload() {
      this.adminService.clearUsers();
      this.adminService.getUsers().subscribe(data => {
        this.dataSource.data = data;
      });
    }
    applyFilter(arg) {
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
      setEmployee(employee: Employee) {
        this.selectedEmployee = employee;
        this.verifyEmployee(employee);
      }
      getEmployee(): object {
        console.log(this.selectedEmployee);
        return this.selectedEmployee;
      }
      ngOnInit() {
        this.adminService.getUsers().subscribe(data => {
          this.dataSource.data = data;
        });
        this.adminService.getEmployees().subscribe((data) => {
          data.map((item) => {
            item.fullSearchName = '(' + item.employeeId + ') ' + item.firstName + ' ' + item.middleName + ' ' + item.lastName;
          });
          this.employees = data;
        });
          this.myForm = new FormGroup({
              firstName: new FormControl(null, Validators.required),
              middleName: new FormControl(null, Validators.required),
              lastName: new FormControl(null, Validators.required),
              role: new FormControl(null, Validators.required),
              username: new FormControl(null, [Validators.required, Validators.email]),
              password: new FormControl(null, [Validators.required, Validators.minLength(10)]),
              confirmPassword: new FormControl(null, Validators.required),
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
      verifyPassword() {
        this.myForm.valueChanges.subscribe(field => {
          if (this.myForm.value.password !== this.myForm.value.confirmPassword) {
            this.myForm.controls.confirmPassword.setErrors({mismatch: true});
          } else {
            this.myForm.controls.confirmPassword.setErrors(null);
          }
        });
      }
      verifyEmployee(employee) {
          if (employee.firstName !== this.myForm.value.firstName) {
            this.employeeCtrl.setErrors({mismatch: true});
          } else {
            this.employeeCtrl.setErrors(null);
          }
      }
      deleteUser(event) {
        console.log(event);
        this.adminService.deleteUser(event._id).subscribe(data => {
          console.log(data);
          this.reload();
        }, error => {
          console.log(error);
        });
      }
}
