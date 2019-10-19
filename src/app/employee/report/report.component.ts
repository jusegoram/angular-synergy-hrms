import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { noop } from 'rxjs';
import { EmployeeShift } from '../Employee';
import { Workpattern } from '../../administration/employee/models/positions-models';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
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
  positionInfoToggle = false;
  shiftInfoToggle= false;
  attritionInfoToggle= false;
  familyInfoToggle= false;
   wb: XLSX.WorkBook;
  selectedTab = 0;
  avatarQuery = {
    reportType: 'avatar',
    employeeStatus: 'active'
  };
  mainQuery = {
    reportType: 'main',
    employeeStatus: 'active'
  };
  companyQuery = {
    reportType: 'company',
    employeeStatus: 'active'
  };
  shiftQuery = {
    reportType: 'shift',
    employeeStatus: 'active'
  };
  positionQuery = {
    reportType: 'position',
    employeeStatus: 'active'
  };
  payrollQuery = {
    reportType: 'payroll',
    employeeStatus: 'active'
  };
  personalQuery = {
    reportType: 'personal',
    employeeStatus: 'active'
  };
  familyQuery = {
    reportType: 'family',
    employeeStatus: 'active'
  };
  constructor(private employeeService: EmployeeService, private fb: FormBuilder) {
    this.clients = [];
    this.campaigns = [];
    this.status = this.employeeService.status;
  }

  public clickMain = (event) => {
    this.mainInfoToggle = !this.mainInfoToggle;
  }
  public clickCompany = (event) => {
    this.companyInfoToggle = !this.companyInfoToggle;
  }
  public clickPersonal = (event) => {
    this.personalInfoToggle = !this.personalInfoToggle;
  }
  public clickPosition = (event) => {
    this.positionInfoToggle = !this.positionInfoToggle;
  }
  public clickShift = (event) => {
    this.shiftInfoToggle = !this.shiftInfoToggle;
  }
  public clickAttrition = (event) => {
    this.attritionInfoToggle = !this.attritionInfoToggle;
  }
  public clickEmergency = (event) => {
    this.familyInfoToggle = !this.familyInfoToggle;
  }


  ngOnInit() {
    this.employeeService.getClient().subscribe(data => this.clients = data);
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
    this.mainInfoToggle = true;
    this.companyInfoToggle = false;
    this.personalInfoToggle = false;
    this.positionInfoToggle = false;
    this.shiftInfoToggle = false;
    this.attritionInfoToggle = false;
    this.familyInfoToggle = false;

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
    this.employeeService.getReport(obj).subscribe(
        data => {
          this.buildTable(data);
        }, error => { console.error(error); });
  }
  export() {
    const data: any = this.dataSource.data;
    const promiseArray = [];

    if (this.mainInfoToggle) {promiseArray.push(this.exportMain(data)); }
    if (this.companyInfoToggle) {promiseArray.push(this.exportCompany(data)); }
    if (this.personalInfoToggle) {promiseArray.push(this.exportPersonal(data)); }
    if (this.positionInfoToggle) {promiseArray.push(this.exportPosition(data)); }
    if (this.shiftInfoToggle) {promiseArray.push(this.exportShift(data)); }
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
    const promise = new Promise((res, rej) => {
      const mainInfo: any[] = [];
      data.forEach(element => {
        if (typeof element !== 'undefined' && element !== null) {
          const mainData = {
            _id: element._id,
            employeeId: element.employeeId,
            firstName: element.firstName,
            middleName: element.middleName,
            lastName: element.lastName,
            gender: element.gender,
            socialSecurity: element.socialSecurity,
            status: element.status,
            client: (typeof element.company !== 'undefined' && element.company !== null)
            ? element.company.client : '',
            campaign:  (typeof element.company !== 'undefined' && element.company !== null)
            ? element.company.campaign : '',
            manager: (typeof element.company !== 'undefined' && element.company !== null)
            ? element.company.manager : '',
            supervisor: (typeof element.company !== 'undefined' && element.company !== null)
            ? element.company.supervisor : '',
            trainer: (typeof element.company !== 'undefined' && element.company !== null)
            ? element.company.trainer : '',
            trainingGroup: (typeof element.company !== 'undefined' && element.company !== null)
            ? element.company.trainingGroup : '',
            hireDate: (typeof element.company !== 'undefined' && element.company !== null)
            ? element.company.hireDate : '',
            terminationDate: (typeof element.company !== 'undefined' && element.company !== null)
            ? element.company.terminationDate : '',
            reapplicant: (typeof element.company !== 'undefined' && element.company !== null)
            ? element.company.reapplicant : '',
            reapplicantTimes: (typeof element.company !== 'undefined' && element.company !== null)
            ? element.company.reapplicantTimes : '',
            bilingual: (typeof element.company !== 'undefined' && element.company !== null)
            ? element.company.bilingual : '',
          };
          mainInfo.push(mainData);
        }
      });
      const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mainInfo);
        XLSX.utils.book_append_sheet(this.wb, main, 'main-info');
        res();
    });
    return promise;
  }
  exportCompany(data) {
    const promise = new Promise((res, rej) => {
      const companyInfo: any[] = [];
      data.forEach(element => {
        (typeof element.company !== 'undefined' && element.company !== null)
      ? companyInfo.push(element.company) : noop();
      });
      const company: XLSX.WorkSheet = XLSX.utils.json_to_sheet(companyInfo);
      XLSX.utils.book_append_sheet(this.wb, company, 'company-info');
      res();
    });
    return promise;
  }

  exportPersonal(data){
    const promise = new Promise((res, rej) => {
      const personalInfo: any[] = [];
      let hobbiesInfo: any[] = [];
      let previous = []
      data.forEach(async element => {
        if(element.personal && element.personal.hobbies) {
          let mapped = element.personal.hobbies.map(item => {
            delete item._id
            item.employeeId = element.personal.employeeId;
            return item;
          });
          previous = JSON.parse(JSON.stringify(hobbiesInfo));
          hobbiesInfo = previous.concat((typeof element.personal !== 'undefined' && element.personal !== null)
          ? mapped : [] );
        }
        (typeof element.personal !== 'undefined' && element.personal !== null)
      ? personalInfo.push(element.personal) : noop();
      });
      console.log(hobbiesInfo);
      const personal: XLSX.WorkSheet = XLSX.utils.json_to_sheet(personalInfo);
      const hobbies: XLSX.WorkSheet = XLSX.utils.json_to_sheet(hobbiesInfo);
      XLSX.utils.book_append_sheet(this.wb, personal, 'personal-info');
      XLSX.utils.book_append_sheet(this.wb, hobbies, 'hobbies-info');
      res();
    });
    return promise;
  }

  exportPosition(data){
    return new Promise((resolve, reject) => {
      const positionInfo: any[] = [];
      data.forEach(element => {
        const position = element.position[element.position.length - 1];
        if (position && position.position) {
              position.name = position.position.name;
              position.positionId = position.position.positionId;
              const exportPosition = {
                employeeId: position.employeeId,
                client: position.client,
                department: position.department,
                positionId: position.positionId,
                positionName: position.name,
                startDate: position.startDate,
                endDate: position.endDate,
              };
              positionInfo.push(exportPosition);
        }
      });
      const position: XLSX.WorkSheet = XLSX.utils.json_to_sheet(positionInfo);
      XLSX.utils.book_append_sheet(this.wb, position, 'position-info');
      resolve();
    });
  }

  exportShift(data) {
    const promise = new Promise((res, rej) => {
      const shiftInfo: any[] = [];
    data.forEach(element => {
      const workpatterns = element.shift;
      const workpattern = workpatterns[workpatterns.length - 1];
      const exportShift: any = {};
      if (workpattern) {
        const shift = workpattern.shift;
        const week = shift.shift;
        if (shift !== undefined) {
          exportShift._id = workpattern._id;
          exportShift.employeeId = workpattern.employeeId;
          exportShift.name = shift.name;
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
    res();
    });
    return promise;
  }

  exportComments(data) {
    const promise = new Promise((res, rej) => {
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
    const promise = new Promise((res, rej) => {
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
    const promise = new Promise((res, rej) => {
      const familyInfo: any[] = [];
      data.forEach(element => {
        const familyArr: any[] = element.family;
        if (typeof familyArr !== 'undefined' && familyArr !== null && familyArr.length !== 0) {
          familyArr.forEach(item => {
            const familyExport = {
              _id: item._id,
              employeeId: item.employeeId,
              referenceName: item.referenceName,
              relationship: item.relationship,
              celNumber: item.celNumber,
              telNumber: item.telNumber,
              emailAddress: item.emailAddress,
              address: item.address,
              employee: item.employee,
            };
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

  tabChanged(event){
    this.selectedTab = event.index;
  }
  clear() {
    this.dataSource = null;
    this.data = null;
    this.buildForm();
  }
}
