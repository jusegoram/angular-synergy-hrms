import { SessionService } from './../../session/services/session.service';
import { User } from '../../session/User';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AdminService } from '../services/admin.services';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {
  myForm: FormGroup;
  employees: any;
  selectedValue = 0;
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
    onSubmit() {
          const user = new User(
              this.myForm.value.username,
              this.myForm.value.password,
              this.myForm.value.role,
              this.myForm.value.firstName,
              this.myForm.value.middleName,
              this.myForm.value.lastName,
              new Date(),
              this.myForm.value.employee, // Employee _id
              null
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
          this.router.navigateByUrl('/employee');
      }

      ngOnInit() {
          this.myForm = new FormGroup({
              firstName: new FormControl(null, Validators.required),
              middleName: new FormControl(null, Validators.required),
              lastName: new FormControl(null, Validators.required),
              role: new FormControl(null, Validators.required),
              username: new FormControl(null, Validators.required),
              password: new FormControl(null, Validators.required),
              employee: new FormControl(null, Validators.required)
          });
          this.adminService.getEmployees().subscribe((data) => {
            this.employees = data;
            console.log(this.employees);
          });
      }
}
