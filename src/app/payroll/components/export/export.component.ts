import {Component, OnInit} from '@angular/core';
import {PayrollService} from '../../services/payroll.service';
import * as XLSX from 'xlsx';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import moment from 'moment';


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
  mainInfoToggle = true;
  companyInfoToggle = false;
  personalInfoToggle = false;
  payrollInfoToggle = false;
  positionInfoToggle = false;
  shiftInfoToggle = false;
  attritionInfoToggle = false;
  familyInfoToggle = false;
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
  constructor(
    private _payrollService: PayrollService, private fb: FormBuilder
  ) {
    this.clients = [];
    this.campaigns = [];
    this.status = this._payrollService.status;
  }

  public clickMain = event => {
    this.mainInfoToggle = !this.mainInfoToggle;
  }
  public clickCompany = event => {
    this.companyInfoToggle = !this.companyInfoToggle;
  }
  public clickPersonal = event => {
    this.personalInfoToggle = !this.personalInfoToggle;
  }

  public clickPayroll = event => {
    this.payrollInfoToggle = !this.payrollInfoToggle;
  }

  public clickPosition = event => {
    this.positionInfoToggle = !this.positionInfoToggle;
  }
  public clickShift = event => {
    this.shiftInfoToggle = !this.shiftInfoToggle;
  }
  public clickAttrition = event => {
    this.attritionInfoToggle = !this.attritionInfoToggle;
  }
  public clickEmergency = event => {
    this.familyInfoToggle = !this.familyInfoToggle;
  }
  public clickComments = event => {
    this.commentsInfoToggle = !this.commentsInfoToggle;
  }

  ngOnInit() {
    this._payrollService.getClient(this._payrollService.getDecodedToken().clients).subscribe(data => (this.clients = data));
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
      'company.hireDate': {
        $gte: moment(queryParam.hireDateFrom).format('MM/DD/YYYY').toString(),
        $lte: moment(queryParam.hireDateTo).format('MM/DD/YYYY').toString()
      },
      'company.terminationDate': {
        $gte: moment(queryParam.terminationDateFrom).format('MM/DD/YYYY').toString(),
        $lte: moment(queryParam.terminationDateTo).format('MM/DD/YYYY').toString()
      },
      'company.trainingGroupRef': queryParam.trainingGroup,
      'company.trainingGroupNum': queryParam.trainingNo
    };
    this._payrollService.getReport(obj).subscribe(
      data => {
        this.buildTable(data);
      },
      error => {
        console.error(error);
      }
    );
  }
  export() {
    const data: any = this.dataSource.data;
    const promiseArray = [];
    promiseArray.push(this.exportMain(data));
    Promise.all(promiseArray)
      .then(result => {
        XLSX.writeFile(this.wb, 'export-info.xlsx');
      })
      .catch(err => console.log(err));
  }
  exportMain(data) {
    const promise = new Promise((res, rej) => {
      const mainInfo: any[] = [];
      data.forEach(element => {
        if (typeof element !== 'undefined' && element !== null) {
          const companyData = this.exportCompany(element);
          const personalData = this.exportPersonal(element);
          const payrollData = this.exportPayroll(element);
          const positionData = this.exportPosition(element);
          const shiftData = this.exportShift(element);
          const commentsData = this.exportComments(element);
          const attritionData = this.exportAttrition(element);
          const familyData = this.exportEmergency(element);
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
            ...payrollData,
            ...shiftData,
            ...personalData,
            ...commentsData,
            ...attritionData,
            ...familyData
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
    if (this.companyInfoToggle) {
      return {
        client:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.client
            : '',
        campaign:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.campaign
            : '',
        manager:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.manager
            : '',
        supervisor:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.supervisor
            : '',
        trainer:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.trainer
            : '',
        trainingGroupRef:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.trainingGroupRef
            : '',
        trainingGroupNum:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.trainingGroupNum
            : '',
        hireDate:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.hireDate
            : '',
        terminationDate:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.terminationDate
            : '',
        reapplicant:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.reapplicant
            : '',
        reapplicantTimes:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.reapplicantTimes
            : '',
        bilingual:
          typeof element.company !== 'undefined' && element.company !== null
            ? element.company.bilingual
            : ''
      };
    } else {
      return {};
    }
  }

  exportPersonal(element) {
    if (this.personalInfoToggle) {
      const personal =
        typeof element.personal !== 'undefined' && element.personal !== null
          ? element.personal
          : null;
      if (
        personal !== null &&
        personal.hobbies &&
        personal.hobbies.length > 0
      ) {
        for (let index = 0; index < personal.hobbies.length; index++) {
          const hobby = personal.hobbies[index];
          personal['Hobby Title.' + index] = hobby.hobbyTitle;
          personal['Hobby Comment.' + index] = hobby.hobbyComment;
          personal['Hobby Creation Date' + index] = hobby.createdAt;
        }
        return personal;
      } else {
        return personal;
      }
    } else {
      return {};
    }
  }

  exportPayroll(element) {
    if(this.payrollInfoToggle){
        if (typeof element.payroll !== 'undefined' && element.payroll !== null) {
          const payroll = element.payroll;
          const exportPayroll = {
            employeeId: payroll.employeeId,
            billable: payroll.billable,
            payrollType: payroll.payrollType,
            TIN: payroll.TIN,
            bankName: payroll.bankName,
            bankAccount: payroll.bankAccount,
          }
          return exportPayroll;
        }
      } else {
        return {};
      }
  }

  exportPosition(element) {
    if (this.positionInfoToggle) {
      const position = element.position[element.position.length - 1];
      if (position && position.position) {
        position.name = position.position.name;
        position.positionId = position.position.positionId;
        const exportPosition = {
          positionClient: position.client,
          department: position.department,
          positionId: position.positionId,
          positionName: position.name,
          baseWage: position.baseWage,
          positionStartDate: position.startDate,
          positionEndDate: position.endDate
        };
        return exportPosition;
      }
    } else {
      return {};
    }
  }

  exportShift(element) {
    const shift = element.shift;
    if (this.shiftInfoToggle) {
      const exportShift: any = {};
      for (let i = 0; i < shift.length; i++) {
        const day = shift[i];
        exportShift[moment(day.date)
      .format('MM/DD/YYYY')
      .toString()] =
      `${this.transformTime(day.shiftStartTime)} - ${this.transformTime(day.shiftEndTime)}`;
      }
      return exportShift !== null && exportShift !== undefined
        ? exportShift
        : {};
    } else {
      return {};
    }
  }

  exportComments(element) {
    if (this.commentsInfoToggle) {
      const returnItem: any = {};
      if (
        element.comments !== undefined &&
        element.comments !== null &&
        element.comments.length > 0
      ) {
        element.comments.forEach((commentsItem, index) => {
          returnItem['Comment.' + index] = commentsItem.comment;
          returnItem['Comment Date.' + index] = commentsItem.commentDate;
          returnItem['Submitted By' + index] =
            commentsItem.submittedBy !== null
              ? commentsItem.submittedBy.firstName +
                ' ' +
                commentsItem.submittedBy.lastName
              : '';
        });
        return returnItem;
      } else {
        return {};
      }
    } else {
      return {};
    }
  }

  exportAttrition(element) {
    if (this.attritionInfoToggle) {
      const returnItem: any = {};
      if (
        element.attrition !== undefined &&
        element.attrition !== null &&
        element.attrition.length > 0
      ) {
        element.attrition.forEach((attritionItem, index) => {
          returnItem['Attrition Reason 1.' + index] = attritionItem.reason1
            ? attritionItem.reason1
            : '';
          returnItem['Attrition Reason 2.' + index] = attritionItem.reason2
            ? attritionItem.reason2
            : '';
          returnItem['Attrition Comment.' + index] = attritionItem.comment
            ? attritionItem.comment
            : '';
          returnItem['Attrition Date.' + index] = attritionItem.commentDate
            ? attritionItem.date
            : '';
        });
        return returnItem;
      } else {
        return {};
      }
    } else {
      return {};
    }
  }
  exportEmergency(element) {
    if (this.familyInfoToggle) {
      const familyArr = element.family;
      const returnItem: any = {};
      if (
        typeof familyArr !== 'undefined' &&
        familyArr !== null &&
        familyArr.length !== 0
      ) {
        familyArr.forEach((item, index) => {
          returnItem['Contact Reference Name.' + index] = item.referenceName;
          returnItem['Contact Relationship.' + index] = item.relationship;
          returnItem['Contact Cellphone.' + index] = item.celNumber;
          returnItem['Contact Telephone.' + index] = item.telNumber;
          returnItem['Contact Email.' + index] = item.emailAddress;
          returnItem['Contact Home Address.' + index] = item.address;
        });
        return returnItem;
      } else {
        return {};
      }
    }
    return {};
  }
  setCampaigns(event: any) {
    this.campaigns = event.campaigns;
  }
  transformTime(param: any): string {
    let result = '00:00';
    if (param !== null) {
      if (param.toString().includes(':')) {
        return param;
      }
      const stored = parseInt(param, 10);
      const hours = Math.floor(stored / 60);
      const minutes = stored - hours * 60;
      const fixedMin = minutes === 0 ? '00' : minutes;
      result = hours + ':' + fixedMin;
      return result;
    } else {
      return result;
    }
  }

  buildTable(event: any) {
    if (event.length !== 0) {
      this.displayedColumns = [
        'employeeId',
        'firstName',
        'middleName',
        'lastName',
        'gender',
        'socialSecurity',
        'status'
      ];
      this.dataSource = new MatTableDataSource(event);
      this.data = event;
    }
  }

  tabChanged(event) {
    this.selectedTab = event.index;
  }
  clear() {
    this.dataSource = null;
    this.data = null;
    this.buildForm();
  }
}
