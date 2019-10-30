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
  commentsInfoToggle = false;
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
  public clickComments = (event) => {
    this.commentsInfoToggle = !this.commentsInfoToggle;
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
    this.commentsInfoToggle = false;
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
    if (this.shiftInfoToggle) {promiseArray.push(this.exportShift(data)); }
    if (this.attritionInfoToggle) {
      promiseArray.push(this.exportAttrition(data));
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
          const companyData = this.exportCompany(element);
          const personalData = this.exportPersonal(element);
          const positionData = this.exportPosition(element);
          const shiftData = this.exportShift(element);
          const commentsData = this.exportComments(element);
          const attritionData = this.exportAttrition(element);
          const familyData= this.exportEmergency(element);
          const mainData = {
            employeeId: element.employeeId,
            firstName: element.firstName,
            middleName: element.middleName,
            lastName: element.lastName,
            gender: element.gender,
            socialSecurity: element.socialSecurity,
            status: element.status,
            ...companyData,
            ...positionData,
            ...shiftData,
            ...personalData,
            ...commentsData,
            ...attritionData,
            ...familyData,
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
  exportCompany(element) {
    if(this.companyInfoToggle) return {
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
    }
   else return {};
  }

  exportPersonal(element){
    if(this.personalInfoToggle) {
      const personal = (typeof element.personal !== 'undefined' && element.personal !== null)
      ? element.personal : null;
      if(personal !== null && personal.hobbies && personal.hobbies.length > 0) {
          for (let index = 0; index < personal.hobbies.length; index++) {
            const hobby = personal.hobbies[index];
            personal['Hobby Title.'+index] = hobby.hobbyTitle;
            personal['Hobby Comment.'+index] = hobby.hobbyComment;
            personal['Hobby Creation Date'+index]= hobby.createdAt;
          }
        return personal;
      }else{
        return personal;
      }
    }else return {}


  }

  exportPosition(element){
        if(this.positionInfoToggle) {
          const position = element.position[element.position.length - 1];
          if (position && position.position) {
                position.name = position.position.name;
                position.positionId = position.position.positionId;
                const exportPosition = {
                  client: position.client,
                  department: position.department,
                  positionId: position.positionId,
                  positionName: position.name,
                  startDate: position.startDate,
                  endDate: position.endDate,
                };
                return exportPosition
          }
        }else return {}
  }

  exportShift(element) {
      if(this.shiftInfoToggle){
        const workpatterns = element.shift;
        const workpattern = workpatterns[0];
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
        return (typeof exportShift._id !== 'undefined' && exportShift !== null)
        ? exportShift : {};
      }else return {}
  }

  exportComments(element) {
        if(this.commentsInfoToggle){
          let returnItem: any = {};
          if ( element.comments !== undefined  && element.comments !== null && element.comments.length > 0) {
            element.comments.forEach((commentsItem, index) => {
              returnItem['Comment.'+ index] = commentsItem.comment;
              returnItem['Comment Date.'+ index] = commentsItem.commentDate;
              returnItem['Submitted By'+ index] = commentsItem.submittedBy !== null ? commentsItem.submittedBy.firstName +' '+ commentsItem.submittedBy.lastName : '';
            });
            return returnItem;
          }else return {};
        }else return {}
  }

  exportAttrition(element) {
    if(this.attritionInfoToggle) {
      let returnItem: any = {};
      console.log(element.attrition)
      if (element.attrition !== undefined && element.attrition !== null && element.attrition.length > 0) {
        element.attrition.forEach((attritionItem, index) => {
            returnItem['Attrition Reason 1.'+index] = attritionItem.reason1? attritionItem.reason1: '';
            returnItem['Attrition Reason 2.'+index] = attritionItem.reason2? attritionItem.reason2: '';
            returnItem['Attrition Comment.'+index]  = attritionItem.comment? attritionItem.comment: '' ;
            returnItem['Attrition Date.'+index] = attritionItem.commentDate ? attritionItem.date: '';
        });
        return returnItem;
      }else return {}
    }else return {}
  }
  exportEmergency(element) {
    if(this.familyInfoToggle) {
      const familyArr = element.family;
      let returnItem: any = {};
      if (typeof familyArr !== 'undefined' && familyArr !== null && familyArr.length !== 0) {
        familyArr.forEach((item, index) => {
          returnItem['Contact Reference Name.'+ index] = item.referenceName;
          returnItem['Contact Relationship.'+ index] = item.relationship;
          returnItem['Contact Cellphone.'+ index] = item.celNumber;
          returnItem['Contact Telephone.'+ index] = item.telNumber;
          returnItem['Contact Email.'+ index] = item.emailAddress;
          returnItem['Contact Home Address.'+ index] = item.address;
        });
        return returnItem;
      }else return {}
    }return {}
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
