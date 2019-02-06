import { Component, OnInit } from '@angular/core';
import { PayrollService } from '../../services/payroll.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { noop } from 'rxjs';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  data: any;
  clients: any[];
  campaigns: any[];
  status: any[];
  dataSource: any;
  reportForm: FormGroup;
  queryForm: FormGroup;
  sheetControl: FormControl;
  displayedColumns = [];
  mainInfoToggle= true;
  companyInfoToggle= false;
  personalInfoToggle= false;
  shiftInfoToggle= false;
  attritionInfoToggle= false;
  familyInfoToggle= false;
  positionInfoToggle= false;
  payrollInfoToggle= false;

   wb: XLSX.WorkBook;

  constructor(private _payrollService: PayrollService, private fb: FormBuilder) {
    this.clients = [];
    this.campaigns = [];
    this.status = this._payrollService.status;
  }

  public clickMain = (event) => {
    this.mainInfoToggle = !this.mainInfoToggle
  }
  public clickCompany = (event) => {
    this.companyInfoToggle = !this.companyInfoToggle
  }
  public clickPersonal = (event) => {
    this.personalInfoToggle = !this.personalInfoToggle
  }
  public clickShift = (event) => {
    this.shiftInfoToggle = !this.shiftInfoToggle
  }
  public clickAttrition = (event) => {
    this.attritionInfoToggle = !this.attritionInfoToggle
  }
  public clickEmergency = (event) => {
    this.familyInfoToggle = !this.familyInfoToggle
  }

  public clickPosition = (event) => {
    this.positionInfoToggle = !this.positionInfoToggle
  }
  public clickPayroll = (event) => {
    this.payrollInfoToggle = !this.payrollInfoToggle
  }

  ngOnInit() {
    this._payrollService.getClient().subscribe(data => this.clients = data);
    this.buildForm();
  }
  buildForm() {
    this.reportForm = this.fb.group({
      statusCheck: [false],
      clientCheck: [false],
      campaignCheck: [false],
      supervisorCheck: [false],
      hireDateCheck: [false],
      terminationDateCheck: [false],
      managerCheck: [false],
      trainingGroupCheck: [false]
    });

    this.queryForm = this.fb.group({
      status: [''],
      client: [''],
      campaign: [''],
      supervisor: [''],
      hireDateFrom: [''],
      hireDateTo: [new Date()],
      terminationDateFrom: [''],
      terminationDateTo: [new Date()],
      manager: [''],
      trainingGroup: [''],
      trainingNo: ['']
    });

    this.sheetControl = new FormControl();
    this.wb = XLSX.utils.book_new();
    this.mainInfoToggle= true;
    this.companyInfoToggle= false;
    this.personalInfoToggle= false;
    this.shiftInfoToggle= false;
    this.attritionInfoToggle= false;
    this.familyInfoToggle= false;
    this.positionInfoToggle= false;
    this.payrollInfoToggle= false;
  }
  getReport() {
    const queryParam = this.queryForm.value;
    const obj = {
      status: queryParam.status,
      'company.client': queryParam.client.name,
      'company.campaign': queryParam.campaign.name,
      'company.supervisor': queryParam.supervisor,
      'company.manager': queryParam.manager,
      'company.hireDate': { $gte: queryParam.hireDateFrom, $lt: queryParam.hireDateTo},
      'company.terminationDate': {$gte: queryParam.terminationDateFrom, $lt: queryParam.terminationDateTo},
      'company.trainingGroupRef': queryParam.trainingGroup,
      'company.trainingGroupNum': queryParam.trainingNo
    };
    this._payrollService.getReport(obj).subscribe(
        data => {
          this.buildTable(data);
          console.log(data);
        }, error => { console.error(error); });
  }
  export() {
    const data: any = this.dataSource.data;
    let promiseArray = [];

    if (this.mainInfoToggle) promiseArray.push(this.exportMain(data));
    if(this.payrollInfoToggle) promiseArray.push(this.exportPayroll(data));
    if (this.companyInfoToggle) promiseArray.push(this.exportCompany(data));
    if (this.personalInfoToggle) promiseArray.push(this.exportPersonal(data));
    if(this.positionInfoToggle) promiseArray.push(this.exportPosition(data));
    if (this.shiftInfoToggle) promiseArray.push(this.exportShift(data));
    if (this.attritionInfoToggle) {
      promiseArray.push(this.exportAttrition(data));
      promiseArray.push(this.exportComments(data));
    }
    if (this.familyInfoToggle) promiseArray.push(this.exportEmergency(data));
    /* generate worksheet */
    Promise.all(promiseArray)
      .then(result => {
        XLSX.writeFile(this.wb, 'export-info.xlsx');
      }).catch(err => console.log(err));
  }
  exportMain(data) {
    let promise = new Promise((res, rej) => {
      const mainInfo: any[] = [];
      data.forEach(element => {
        if(typeof element !== 'undefined' && element !== null) {
          let mainData = {
            _id: element._id,
            employeeId: element.employeeId,
            firstName: element.firstName,
            middleName: element.middleName,
            lastName: element.lastName,
            gender: element.gender,
            socialSecurity: element.socialSecurity,
            status: element.status,
          }
          mainInfo.push(mainData);
        }
      });
      const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mainInfo);
        XLSX.utils.book_append_sheet(this.wb, main, 'main-info');
        console.log('added main');
        res();
    });
    return promise;
  }
  exportCompany(data) {
    let promise = new Promise((res, rej) => {
      const companyInfo: any[] = [];
      data.forEach(element => {
        (typeof element.company !== 'undefined' && element.company !== null)
      ? companyInfo.push(element.company) : noop();
      });
      const company: XLSX.WorkSheet = XLSX.utils.json_to_sheet(companyInfo);
      XLSX.utils.book_append_sheet(this.wb, company, 'company-info');
      console.log('added company');
      res();
    });
    return promise;
  }

  exportPersonal(data){
    let promise = new Promise((res, rej) => {
      const personalInfo: any[] = [];
      data.forEach(element => {
        (typeof element.personal !== 'undefined' && element.personal !== null)
      ? personalInfo.push(element.personal) : noop();
      });
      const personal: XLSX.WorkSheet = XLSX.utils.json_to_sheet(personalInfo);
      XLSX.utils.book_append_sheet(this.wb, personal, 'personal-info');
      res();
    });
    return promise;
  }

  exportPayroll(data){
    let promise = new Promise((res, rej) => {
      const payrollInfo: any[] = [];
      data.forEach(element => {
      if (typeof element.payroll !== 'undefined' && element.payroll !== null) {
        let payroll = element.payroll;
        let exportPayroll = {
          _id: payroll._id,
          employeeId: payroll.employeeId,
          billable: payroll.billable,
          payrollType: payroll.payrollType,
          TIN: payroll.TIN,
          bankName: payroll.bankName,
          bankAccount: payroll.bankAccount,
        }
        payrollInfo.push(exportPayroll);
      }
      });
      const payroll: XLSX.WorkSheet = XLSX.utils.json_to_sheet(payrollInfo);
      XLSX.utils.book_append_sheet(this.wb, payroll, 'payroll-info');
      res();
    });
    return promise;
  }

  exportPosition(data){
    return new Promise((resolve, reject) => {
      const positionInfo: any[] = [];
      data.forEach(element => {
        let position = element.position[element.position.length-1];
        if(position) {
          position.baseWage = position.position.baseWage;
        position.name = position.position.name;
        position.positionId = position.position.positionId;

        let exportPosition = {
          employeeId: position.employeeId,
          client: position.client,
          department: position.department,
          positionId: position.positionId,
          positionName: position.name,
          baseWage: position.baseWage,
          startDate: position.startDate,
          endDate: position.endDate,
        }

        positionInfo.push(exportPosition);
        }
      });
      const position: XLSX.WorkSheet = XLSX.utils.json_to_sheet(positionInfo);
      XLSX.utils.book_append_sheet(this.wb, position, 'position-info');
      resolve();
    });
  }
  exportShift(data) {
    let promise = new Promise((res, rej) => {
      const shiftInfo: any[] = [];
    data.forEach(element => {
      let workpatterns = element.shift;
      let workpattern = workpatterns[workpatterns.length-1];
      let exportShift: any = {};
      if (workpattern) {
        const shift = workpattern.shift;
        const week = shift.shift;
        if(shift !== undefined) {
          exportShift._id = workpattern._id;
          exportShift.employeeId = workpattern.employeeId;
          exportShift.name = shift.name
        exportShift.monday = ( week[0].onShift) ?
        this.transformTime(week[0].startTime) + ' - ' + this.transformTime(week[0].endTime) : 'DAY OFF';
        exportShift.tuesday = ( week[1].onShift) ?
        this.transformTime(week[1].startTime) + ' - ' + this.transformTime(week[1].endTime) : 'DAY OFF';
        exportShift.wednesday = ( week[2].onShift) ?
        this.transformTime(week[2].startTime) + ' - ' + this.transformTime(week[2].endTime) : 'DAY OFF';
        exportShift.thursday = ( week[3].onShift) ?
        this.transformTime(week[3].startTime) + ' - ' + this.transformTime(week[3].endTime) : 'DAY OFF';
        exportShift.friday = ( week[4].onShift) ?
        this.transformTime(week[4].startTime) + ' - ' + this.transformTime(week[4].endTime) : 'DAY OFF';
        exportShift.saturday = ( week[5].onShift) ?
        this.transformTime(week[5].startTime) + ' - ' + this.transformTime(week[5].endTime) : 'DAY OFF';
        exportShift.sunday = ( week[6].onShift) ?
        this.transformTime(week[6].startTime) + ' - ' + this.transformTime(week[6].endTime) : 'DAY OFF';
        }
      }
      (typeof exportShift._id !== 'undefined' && exportShift !== null)
      ? shiftInfo.push(exportShift) : noop();
    });
    const shift: XLSX.WorkSheet = XLSX.utils.json_to_sheet(shiftInfo);
    XLSX.utils.book_append_sheet(this.wb, shift, 'shift-info');
    console.log('added shift');
    res();
    });
    return promise;
  }

  exportComments(data) {
    let promise = new Promise((res, rej) => {
      const commentsInfo: any[] = [];
      data.forEach(element => {
        if (typeof element.comments !== 'undefined' && element.comments !== null) {
          element.comments.forEach(commentsItem => {
            commentsInfo.push(commentsItem);
          });
        }
      });
      const comments: XLSX.WorkSheet = XLSX.utils.json_to_sheet(commentsInfo);
      XLSX.utils.book_append_sheet(this.wb, comments, 'comments-info');
      res();
    });
    return promise;
  }



  exportAttrition(data) {
    let promise = new Promise((res, rej) => {
      const attritionInfo: any[] = [];
      data.forEach(element => {
        if (typeof element.attrition !== 'undefined' && element.attrition !== null) {
          element.attrition.forEach(attritionItem => {
            attritionInfo.push(attritionItem);
          });
        }
      });
      const attrition: XLSX.WorkSheet = XLSX.utils.json_to_sheet(attritionInfo);
        XLSX.utils.book_append_sheet(this.wb, attrition, 'attrition-info');
        res();
    });
    return promise;
  }
  exportEmergency(data) {
    let promise = new Promise((res, rej) => {
      const familyInfo: any[] = [];
      data.forEach(element => {
        let familyArr: any[] = element.family
        if (typeof familyArr !== 'undefined' && familyArr !== null && familyArr.length !== 0) {
          familyArr.forEach(item => {
            let familyExport = {
              _id: item._id,
              employeeId: item.employeeId,
              referenceName: item.referenceName,
              relationship: item.relationship,
              celNumber: item.celNumber,
              telNumber: item.telNumber,
              emailAddress: item.emailAddress,
              address: item.address,
              employee: item.employee,
            }
            familyInfo.push(familyExport);
          });
        }
      });
      const family: XLSX.WorkSheet = XLSX.utils.json_to_sheet(familyInfo);
        XLSX.utils.book_append_sheet(this.wb, family, 'emergency-contact-info');
        res();
    });
    return promise;
  }
  setCampaigns(event: any) {
    this.campaigns = event.campaigns;
  }
  transformTime(param): string {
    let result = 'N/A';
        if (param !== null) {
        const stored = parseInt(param, 10);
        const hours = Math.floor(stored / 60);
        const minutes = stored - ( hours * 60 );
        const fixedMin = (minutes === 0) ? '00' : minutes;
        result = hours + ':' + fixedMin;
        }
        return result;
  }

  buildTable(event: any) {
    if ( event.length !== 0) {
    this.displayedColumns = [
      'employeeId', 'firstName', 'middleName',
      'lastName', 'gender', 'socialSecurity',
      'status'];
    this.dataSource = new MatTableDataSource(event);
    this.data = event;
  }
  }

  clear() {
    this.dataSource = null;
    this.data = null;
    this.buildForm();
  }
}
