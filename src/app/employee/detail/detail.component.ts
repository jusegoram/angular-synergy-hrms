import { SessionService } from './../../session/services/session.service';
// import {select, Store} from '@ngrx/store';
import { Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import {Employee, EmployeeCompany} from '../Employee';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Client } from '../../administration/employee/models/positions-models';

 @Component ({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
 employee: Employee;
 company: any;
 newCompany:any;
 isNewCompany: boolean;
 mainForm: FormGroup;
 companyForm: FormGroup;
 clients: any[];
 campaigns: any[];
  constructor(private employeeService: EmployeeService,
    private route: ActivatedRoute, private sessionService: SessionService,
    public snackBar: MatSnackBar, private fb: FormBuilder) {
    this.newCompany = new EmployeeCompany(
      '',
      '', '', '',
      '', '', '',
      '', null,
      null, null,
      null, null);
    this.isNewCompany = false;
  }


  // clients = [
  //   {value: 'American IP', viewValue: ''},
  //   {value: 'CCS', viewValue: ''},
  //   {value: 'KGISL', viewValue: ''},
  //   {value: 'FALCON', viewValue: ''},
  //   {value: 'ATLAS', viewValue: ''},
  //   {value: 'MONOPRICE', viewValue: ''},
  //   {value: 'DENTAL', viewValue: ''},
  //   {value: 'PPP', viewValue: ''},
  //   {value: 'REDIAL', viewValue: ''},
  //   {value: 'AUXIS', viewValue: ''}
  // ];
  // campaigns = [
  //   //american ip
  //   {value: 'locksmith-usa', viewValue: ''},
  //   {value: 'locksmith-canada', viewValue: ''},
  //   {value: 'garage', viewValue: ''},
  //   {value: 'color', viewValue: ''},
  //   //ccs
  //   {value: 'directsat', viewValue: ''},
  //   {value: 'eagan', viewValue: ''},
  //   {value: 'goodman', viewValue: ''},
  //   {value: '1099', viewValue: ''},
  //   //KGISL
  //   {value: 'TIB', viewValue: ''},
  //   {value: 'CIB', viewValue: ''},
  //   //atlas & falcon
  //   {value: 'FNL', viewValue: ''},
  //   //monoprice
  //   {value: 'tracking', viewValue: ''},
  //   // promotion
  //   {value: 'promotion', viewValue: ''},
  //   // ppp
  //   {value: 'MED', viewValue: ''},
  //   // redial
  //   {value: 'ruelala', viewValue: ''},
  //   // auxis
  //   {value: 'SFC', viewValue: ''},
  // ];

  items = [
    { value: 'active', viewValue: 'Active' },
    { value: 'resignation', viewValue: 'Resignation' },
    { value: 'dissmisal', viewValue: 'Dissmisal' },
    { value: 'termination', viewValue: 'Termination' },
    { value: 'undefined', viewValue: 'Undefined' },
    { value: 'trainee', viewValue: 'Trainee' }
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
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' }];

  ngOnInit() {
    this.clients = this.employeeService.clients;
    this.employee = this.route.snapshot.data['employee'];
    if (!this.employee.company) {
      this.employee.company = this.newCompany;
      this.isNewCompany = true;
    }
      this.company = this.employee.company;
    this.buildForms();
    if (!this.clients) {
      this.employeeService.getClient().subscribe(
        data => {
          this.clients = data;
         this.setCampaigns();
        }
      );
    }
    this.setCampaigns();
  }

  buildForms() {
    this.mainForm = this.fb.group({
      firstName: [this.employee.firstName],
      middleName: [this.employee.middleName],
      lastName: [this.employee.lastName],
      gender: [this.employee.gender.toLowerCase()],
      status: [this.employee.status.toLowerCase()],
      currentPosition: [],
      currentPositionId: [],
      currentPositionDate: []
    });
    this.companyForm = this.fb.group({
      client: [this.company.client],
      campaign: [this.company.campaign],
      supervisor: [this.company.supervisor],
      trainer: [this.company.trainer],
      trainingGroupRef: [this.company.trainingGroupRef],
      trainingGroupNum: [this.company.trainingGroupNum],
      hireDate: [this.company.hireDate],
      terminationDate: [this.company.terminationDate],
      reapplicant: [this.company.reapplicant],
      reapplicantTimes: [this.company.reapplicantTimes],
    });
  }
  onSubmit() {
    const employee = new Employee(
      this.employee._id,
      this.employee.employeeId,
      this.mainForm.value.firstName,
      this.mainForm.value.lastName,
      this.employee.socialSecurity,
      this.mainForm.value.status,
      this.mainForm.value.gender, // add to form
      this.mainForm.value.middleName
    );
    this.employeeService.updateEmployee(employee).subscribe(
        data => {
          this.snackBar.open('Employee information updated successfully', 'thank you', {
            duration: 2000,
          });
          },
        error => {
          this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
            duration: 2000,
          });
          console.log(error);
        });
  }

  onCompanySubmit() {
    const employeeCompany = new EmployeeCompany(
      this.company._id,
      this.employee.employeeId + '',
      this.employee._id,
      this.companyForm.value.client,
      this.companyForm.value.campaign,
      this.companyForm.value.supervisor,
      this.companyForm.value.trainer,
      this.companyForm.value.trainingGroupRef,
      this.companyForm.value.trainingGroupNum,
      this.companyForm.value.hireDate,
      this.companyForm.value.terminationDate,
      this.companyForm.value.reapplicant,
      this.companyForm.value.reapplicantTimes,
    );
    if (!this.isNewCompany) {
      this.employeeService.updateCompany(employeeCompany).subscribe(
        data => {
          this.snackBar.open('Employee comapany information updated successfully', 'Thank you', {
            duration: 2000,
          });
        },
        error => {
          console.log(error);
          this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
            duration: 2000,
          });
        });
    } else {
      this.employeeService.saveCompany(employeeCompany).subscribe(
        data => {
          this.snackBar.open('Employee comapany information updated successfully', 'Thank you', {
            duration: 2000,
          });
          this.company = data;
          this.isNewCompany = false;
        },
        error => {
          this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
            duration: 2000,
          });
        });
    }
  }


   setCampaigns() {
     if (this.clients) {
      const i = this.clients.findIndex((result) => result.name === this.companyForm.value.client);
      this.campaigns = this.clients[i].campaigns;
    }
  }
}
