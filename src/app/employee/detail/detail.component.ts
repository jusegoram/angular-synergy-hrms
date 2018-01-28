import { SessionService } from './../../session/services/session.service';

import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Params } from '@angular/router';
import { IEmployee } from '../Employee';
import { EmployeePosition } from '../services/models/employee-models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  public currentRole: number;
  public isAuth = false;
  public currentEmployee: IEmployee;
  public currentPositions: EmployeePosition;
  constructor(private employeeService: EmployeeService,
              private activatedRoute: ActivatedRoute,
              private sessionService: SessionService,
              public snackBar: MatSnackBar) { }
  userId: string;
  myForm: FormGroup;
  // active, resignation, dissmisal, termination, undefined, aplicant, trainee
  items = [
    {value: 'active', viewValue: 'Active'},
    {value: 'resignation', viewValue: 'Resignation'},
    {value: 'dissmisal', viewValue: 'Dissmisal'},
    {value: 'termination', viewValue: 'Termination'},
    {value: 'undefined', viewValue: 'Undefined'},
    {value: 'applicant', viewValue: 'Applicant'},
    {value: 'trainee', viewValue: 'Trainee'}
  ];
  ngOnInit() {
    this.isAuthorized();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.userId = params['id'];
    });
    this.employeeService.getDetails(this.userId).subscribe(
      (employee: IEmployee ) => {
        this.currentEmployee = employee;
    });
    this.myForm = new FormGroup({
      firstName: new FormControl(),
      middleName: new FormControl(),
      lastName: new FormControl(),
      birthDate: new FormControl(),
      client: new FormControl(),
      campaign: new FormControl(),
      status: new FormControl(),
      hireDate: new FormControl(),
      terminationDate: new FormControl()
  });
  }

  onSubmit() {
    const employee = new IEmployee(
      this.currentEmployee.id,
      this.currentEmployee.employeeId,
      this.myForm.value.firstName,
      this.myForm.value.middleName,
      this.myForm.value.lastName,
      this.myForm.value.birthDate,
      this.currentEmployee.socialSecurity,
      this.myForm.value.client,
      this.myForm.value.campaign,
      this.myForm.value.status,
      this.myForm.value.hireDate,
      this.myForm.value.terminationDate
  );
  this.employeeService.updateEmployee(employee)
      .subscribe(
          data => {this.snackBar.open('Employee information UPDATED!', 'Ok', {
            duration: 2000,
          });
        },
          error => {this.snackBar.open('Error updating information, please try again', 'Ok' , {
            duration: 2000,
          });
        }
      );
  }
  public isAuthorized(): boolean {
    this.sessionService.getRole().subscribe(
      (result: number) => {
        this.currentRole = result;
        if (result === 1 || result === 4) {
          this.isAuth = true;
          return true;
        }
      });
        this.isAuth = false;
        return false;
  }
}
