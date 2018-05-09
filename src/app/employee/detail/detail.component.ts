import { SessionService } from './../../session/services/session.service';

import { Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Params } from '@angular/router';
import { IEmployee } from '../Employee';
import { EmployeeCompany, EmployeePosition } from '../services/models/employee-models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Client } from '../../admin/employee/models/positions-models';

 @Component ({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnChanges {
  campaigns: any[];
  // TO DO add reaplicant input and select form.
  // TO DO: add comments component, be able to write a parragraph.

  currentEmployee: IEmployee = new IEmployee('', '', '', '', '', '', 0, '', '');
  currentPosition: EmployeePosition = new EmployeePosition('', '', '', '', '', null, null);
  public currentRole: number;
  public isAuth = false;
  public clients: Client[];
  public currentCompany: EmployeeCompany = new EmployeeCompany( '', '',  '', '', '', '', '', '', 0, null, null , false, 0);
  userId: string;
  mainForm: FormGroup;
  companyForm: FormGroup;
  isNewCompany = false;
  isNew = false;

  constructor(private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    public snackBar: MatSnackBar) { }

  // active, resignation, dissmisal, termination, undefined, aplicant, trainee
  // add bank account, bank name, brithplaceç

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

  ngOnChanges(changes: SimpleChanges) {
    if (this.currentEmployee.employeeId !== '' && changes['currentEmployee']) {
    }
  }
  ngOnInit() {
      this.employeeService.getClient().subscribe((result: any) => { });
      this.employeeService.getDepartment().subscribe((result: any) => { });
    this.isAuthorized();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.userId = params['id'];
    });
    this.employeeService.getDetails(this.userId)
      .subscribe((result: IEmployee) => {
        this.currentEmployee = result;
        if (typeof this.currentEmployee !== 'undefined') {
          this.isNew = false;
        } else {
          this.isNew = true;
          this.currentEmployee = new IEmployee('new', '', '', '', '', '', 0, '');
        }
        this.employeeService.getCompany(this.currentEmployee.employeeId)
                        .subscribe(( company: EmployeeCompany[]) => {
                          this.currentCompany = company[0];
                          if (typeof this.currentCompany === 'undefined') {
                            this.isNewCompany = true;
                            this.currentCompany = new EmployeeCompany('new',  '', '', '', '', '', '', '', 0, null, null , false, 0);
                          }
                          this.employeeService.getCurrentPosition(this.currentEmployee.employeeId)
                            .subscribe((position: EmployeePosition) => {
                            this.currentPosition = position;
                          });
                          this.setCampaigns(this.currentCompany.client);
                        });
              this.clients = this.employeeService.clients;
      });
    this.mainForm = new FormGroup({
      firstName: new FormControl(),
      middleName: new FormControl(),
      lastName: new FormControl(),
      gender: new FormControl(),
      status: new FormControl(),
      currentPosition: new FormControl(),
      currentPositionId: new FormControl(),
      currentPositionDate: new FormControl(),
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
    const employee = new IEmployee(
      this.currentEmployee.id,
      this.currentEmployee.employeeId,
      this.mainForm.value.firstName,
      this.mainForm.value.lastName,
      this.currentEmployee.socialSecurity,
      this.mainForm.value.status,
      parseInt(this.currentEmployee.employeeId, 10),
      this.mainForm.value.gender, // add to form
      this.mainForm.value.middleName
    );
    this.employeeService.updateEmployee(employee)
      .subscribe(
        data => {
          this.snackBar.open('Employee information updated successfully', 'thank you', {
            duration: 2000,
          });
          },
        error => {
          this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
            duration: 2000,
          });
        }
      );

  }

  onCompanySubmit() {
    const employeeCompany = new EmployeeCompany(
      this.currentCompany.id,
      this.currentEmployee.employeeId,
      this.currentEmployee.id,
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
    if (this.isNewCompany) {
      this.employeeService.saveCompany(employeeCompany).subscribe(
        data => {
          this.snackBar.open('Employee comapany saved successfully', 'Thank you', {
            duration: 2000,
          });
        },
        error => {
          this.snackBar.open('Error saving information, please try again or notify the IT department', 'Try again', {
            duration: 2000,
          });
        }
      );
    } else {
      this.employeeService.updateCompany(employeeCompany).subscribe(
        data => {
          this.snackBar.open('Employee comapany information updated successfully', 'Thank you', {
            duration: 2000,
          });
        },
        error => {
          this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
            duration: 2000,
          });
        }
      );
    }
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

  setCampaigns(id: string) {
    const i = this.clients.findIndex((result) => result.id === id);
    this.campaigns = this.clients[i].campaigns;
  }
}
