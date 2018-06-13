import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EmployeeService} from '../services/employee.service';
import {Employee} from '../Employee';

@Component({
  selector: 'new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  created = false;
  mainForm: FormGroup;
  companyForm: FormGroup;

  items = [
    {value: 'active', viewValue: 'Active'},
    {value: 'resignation', viewValue: 'Resignation'},
    {value: 'dissmisal', viewValue: 'Dissmisal'},
    {value: 'termination', viewValue: 'Termination'},
    {value: 'undefined', viewValue: 'Undefined'},
    {value: 'trainee', viewValue: 'Trainee'}
  ];
  reaptimes = [
    {value: 0, viewValue: '0'},
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
    {value: 4, viewValue: '4'},
    {value: 5, viewValue: '5'},
    {value: 6, viewValue: '6'},
    {value: 7, viewValue: '7'},
    {value: 8, viewValue: '8'},
    {value: 9, viewValue: '9'},
    {value: 10, viewValue: '10'}];

  genders = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'}];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.mainForm = new FormGroup({
      firstName: new FormControl(),
      middleName: new FormControl(),
      lastName: new FormControl(),
      gender: new FormControl(),
      status: new FormControl(),
      socialSecurity: new FormControl(),
    });


    this.companyForm = new FormGroup({
      client: new FormControl(),
      campaign: new FormControl(),
      supervisor: new FormControl(),
      trainer: new FormControl(),
      trainingGroupRef: new FormControl(),
      trainingGroupNum: new FormControl(),
      hireDate: new FormControl(),
      terminationDate: new FormControl(),
      reapplicant: new FormControl(),
      reapplicantTimes: new FormControl(),
    });
  }

  onSubmit() {
    const employee = new Employee('',
      null,
      this.mainForm.value.firstName,
      this.mainForm.value.lastName,
      this.mainForm.value.socialSecurity,
      this.mainForm.value.status,
      this.mainForm.value.gender,
      this.mainForm.value.middleName
      )
    this.employeeService.saveEmployee(employee).subscribe((result) => console.log(result));
  }

}
