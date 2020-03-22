import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../employee.service';
import {Employee} from '../Employee';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  created = false;
  mainForm: FormGroup;
  companyForm: FormGroup;
  auth = false;
  items = this.employeeService.status;
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

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit() {
    this.mainForm = new FormGroup({
      idToggle: new FormControl(true),
      employeeId: new FormControl(),
      firstName: new FormControl('' , [Validators.required]),
      middleName: new FormControl(''),
      lastName: new FormControl('' , [Validators.required]),
      gender: new FormControl('' , [Validators.required]),
      status: new FormControl('' , [Validators.required]),
      socialSecurity: new FormControl('' , [Validators.required]),
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
      parseInt(this.mainForm.value.employeeId, 10),
      this.mainForm.value.firstName,
      this.mainForm.value.lastName,
      this.mainForm.value.socialSecurity,
      this.mainForm.value.status,
      this.mainForm.value.gender,
      this.mainForm.value.middleName
      );
    this.employeeService.saveEmployee(employee).subscribe(
      (result) => {
        this.router.navigateByUrl('/employee/detail?id=' + result['_id']);
      }, (error) => {
        console.log(error);
      });
  }

}
