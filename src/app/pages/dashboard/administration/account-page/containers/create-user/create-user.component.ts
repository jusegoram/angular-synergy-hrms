import { AdminService, SessionService } from '@synergy-app/core/services';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Employee } from '@synergy-app/shared/models/employee/employee.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from '@synergy-app/shared/models';

@Component({
  selector: 'adm-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  items = [];
  myForm: FormGroup;
  employeeCtrl = new FormControl();
  employees: any[];
  employeesMap: any[];
  selectedEmployee: Employee;
  selectedValue = 0;
  filteredEmployees: Observable<Employee[]>;
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.items = this.adminService.userTypes;
    this.adminService.getEmployees().subscribe((data) => {
      data.map((item) => {
        item.fullSearchName =
          '(' + item.employeeId + ') ' + item.firstName + ' ' + item.middleName + ' ' + item.lastName;
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
    this.filteredEmployees = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this.employees ? this._filterEmployees(value) : this.employees;
      })
    );
  }
  _filterEmployees(value: string): Employee[] {
    const filterValue = value.toString().toLowerCase();
    return this.employees.filter((employee) => {
      return employee['fullSearchName'].toLowerCase().includes(filterValue);
    });
  }
  verifyPassword() {
    this.myForm.valueChanges.subscribe((field) => {
      if (this.myForm.value.password !== this.myForm.value.confirmPassword) {
        this.myForm.controls.confirmPassword.setErrors({ mismatch: true });
      } else {
        this.myForm.controls.confirmPassword.setErrors(null);
      }
    });
  }
  verifyEmployee(employee) {
    if (employee.firstName !== this.myForm.value.firstName) {
      this.employeeCtrl.setErrors({ mismatch: true });
    } else {
      this.employeeCtrl.setErrors(null);
    }
  }
  setEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.verifyEmployee(employee);
  }
  getEmployee(): object {
    return this.selectedEmployee;
  }
  onSubmit() {
    const log: object = { date: new Date(), log: 'User Creation' };
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
    this.sessionService.signup(user).subscribe(
      (data) => this.snackResponse(data),
      (error) => this.snackResponse()
    );
    this.myForm.reset();
    this.router.navigateByUrl('/admin/permissions');
  }

  snackResponse(param?) {
    if (!param) {
      this.snackBar.open('There was an error creating the user, please contact the IT department', 'OK', {
        duration: 2000,
      });
      return null;
    } else {
      this.snackBar.open('User was created successfully', 'thank you', {
        duration: 2000,
      });
      return null;
    }
  }
}
