import { SessionService } from '../../session/session.service';
import { Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';
import {Employee, EmployeeCompany, Position} from '../Employee';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Client } from '../../administration/employee/models/positions-models';
import { DatePipe, AsyncPipe } from '@angular/common';
import { async } from '@angular/core/testing';

 @Component ({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
 auth: any;
 employee: Employee;
 positions: any;
 latestPos: any;
 company: any;
 newCompany: any;
 isNewCompany: boolean;
 mainForm: FormGroup;
 companyForm: FormGroup;
 clients: any[];
 campaigns: any[];
 items: any[];
 reaptimes: any[];
 genders: any[];
  constructor(private employeeService: EmployeeService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar, private fb: FormBuilder, private datePipe: DatePipe) {
    this.newCompany = new EmployeeCompany(
      '',
      '', '', '',
      '', '', '','',
      '', null,
      null, null,
      null, null);
    this.isNewCompany = false;
    this.items = this.employeeService.status;
    this.reaptimes = this.employeeService.reaptimes;
    this.genders = this.employeeService.genders;
  }

   ngOnInit() {
     this.auth = this.employeeService.getAuth();
     console.log(this.auth);
     this.clients = this.employeeService.clients;
     this.employee = this.route.snapshot.data['employee'];
     this.positions = this.employee.position;
     if (!this.positions[0]) {
       this.latestPos = new Position();
     }else {
      const i = this.positions.length - 1;
      this.latestPos = this.positions[i];
     }
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

   transformDate(date: Date) {
     const dp = new DatePipe('en-US');
     const p = 'M/dd/yyyy';
     const dtr = dp.transform(date, p);
     return dtr;
   }
  buildForms() {
    this.mainForm = this.fb.group({
      firstName: [this.employee.firstName],
      middleName: [this.employee.middleName],
      lastName: [this.employee.lastName],
      gender: [this.employee.gender.toLowerCase()],
      status: [this.employee.status.toLowerCase()],
      currentPosition: [this.latestPos.position.name],
      currentPositionId: [this.latestPos.position.positionId],
      currentPositionDate: [this.transformDate(this.latestPos.startDate)]
    });
    this.companyForm = this.fb.group({
      client: [this.company.client],
      campaign: [this.company.campaign],
      manager:[this.company.manager],
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
        });
  }

  onCompanySubmit() {
    const employeeCompany = new EmployeeCompany(
      this.company._id,
      this.employee.employeeId + '',
      this.employee._id,
      this.companyForm.value.client,
      this.companyForm.value.campaign,
      this.companyForm.value.manager,
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
      if ( i >= 0 ) {this.campaigns = this.clients[i].campaigns; }
    }
  }
}
