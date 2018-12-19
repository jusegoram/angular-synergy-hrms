import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { noop } from '../../../../node_modules/rxjs';
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
  displayedColumns = [];
  constructor(private employeeService: EmployeeService, private fb: FormBuilder) {
    this.clients = [];
    this.campaigns = [];
    this.status = this.employeeService.items;
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
  }
  getReport() {
    const queryParam = this.queryForm.value;
    const obj = {
   //   status: queryParam.status,
      client: queryParam.client.name,
      campaign: queryParam.campaign.name,
      supervisor: queryParam.supervisor,
      manager: queryParam.manager,
      hireDate: { $gte: queryParam.hireDateFrom, $lt: queryParam.hireDateTo},
      terminationDate: {$gte: queryParam.terminationDateFrom, $lt: queryParam.terminationDateTo},
      trainingGroupRef: queryParam.trainingGroup,
      trainingGroupNum: queryParam.trainingNo
    };

    this.employeeService.getReport(obj).subscribe(
        data => {
          let filtered: any;
          filtered = data;
          if (this.reportForm.value.statusCheck) {
            filtered = data.filter(res => res.status === this.queryForm.value.status);
            if (typeof filtered !== 'undefined') {
              this.buildTable(filtered);
            }
          }else {
            console.log(data);
            this.buildTable(data);
          } // console.log(Object.getOwnPropertyNames(data[data.length - 1]));
        }, error => { console.log(error); });
  }
  export() {
    /* generate worksheet */
    const shiftInfo: any[] = [];
    const positionInfo: any[] = [];
    const personalInfo: any[] = [];
    const familyInfo: any[] = [];
    const commentsInfo: any[] = [];
    const orgData: any[] = [];
    const data: any = this.dataSource.data;
    console.log(data);
    data.forEach(element => {
      if (typeof element.shift !== 'undefined') {
        const helperObj = element.shift.shift.shift;
        element.shift.name = element.shift.shift.name;
        element.shift.monday = ( helperObj[0].onShift) ?
        this.transformTime(helperObj[0].startTime) + ' - ' + this.transformTime(helperObj[0].endTime) : 'DAY OFF';
        element.shift.tuesday = ( helperObj[1].onShift) ?
        this.transformTime(helperObj[1].startTime) + ' - ' + this.transformTime(helperObj[1].endTime) : 'DAY OFF';
        element.shift.wednesday = ( helperObj[2].onShift) ?
        this.transformTime(helperObj[2].startTime) + ' - ' + this.transformTime(helperObj[2].endTime) : 'DAY OFF';
        element.shift.thursday = ( helperObj[3].onShift) ?
        this.transformTime(helperObj[3].startTime) + ' - ' + this.transformTime(helperObj[3].endTime) : 'DAY OFF';
        element.shift.friday = ( helperObj[4].onShift) ?
        this.transformTime(helperObj[4].startTime) + ' - ' + this.transformTime(helperObj[4].endTime) : 'DAY OFF';
        element.shift.saturday = ( helperObj[5].onShift) ?
        this.transformTime(helperObj[5].startTime) + ' - ' + this.transformTime(helperObj[5].endTime) : 'DAY OFF';
        element.shift.sunday = ( helperObj[6].onShift) ?
        this.transformTime(helperObj[6].startTime) + ' - ' + this.transformTime(helperObj[6].endTime) : 'DAY OFF';
      }
      (typeof element.shift !== 'undefined' && element.shift !== 'null')
      ? shiftInfo.push(element.shift) : noop();
      (typeof element.position !== 'undefined' && element.position !== 'null')
      ? positionInfo.push(element.position) : noop();
      (typeof element.personal !== 'undefined' && element.personal !== 'null')
      ? personalInfo.push(element.personal) : noop();
      (typeof element.family !== 'undefined' && element.family !== 'null')
      ? familyInfo.push(element.family) : noop();
      (typeof element.comments !== 'undefined' && element.comments !== 'null')
      ? commentsInfo.push(element.comments) : noop();

       orgData.push({
        employeeId: element.employeeId, firstName: element.firstName, middleName: element.middleName,
        lastName: element.lastName, gender: element.gender, client: element.client,
        campaign: element.campaign, status: element.status, hireDate: element.hireDate,
        manager: element.manager, supervisor: element.supervisor, trainer: element.trainer,
        trainingGroupRef: element.trainingGroupRef, trainingGroupNum: element.trainingGroupNum,
        reapplicant: element.reapplicant, reapplicantTimes: element.reapplicantTimes, socialSecurity: element.socialSecurity,
      });
    });

    const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(orgData);
    const shift: XLSX.WorkSheet = XLSX.utils.json_to_sheet(shiftInfo);
    console.log(shiftInfo);
    const position: XLSX.WorkSheet = XLSX.utils.json_to_sheet(positionInfo);
    console.log(positionInfo);
    const personal: XLSX.WorkSheet = XLSX.utils.json_to_sheet(personalInfo);
    console.log(personalInfo);
    const family: XLSX.WorkSheet = XLSX.utils.json_to_sheet(familyInfo);
    console.log(familyInfo);
    const comments: XLSX.WorkSheet = XLSX.utils.json_to_sheet(commentsInfo);
    console.log(commentsInfo);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, main, 'main-info');
    XLSX.utils.book_append_sheet(wb, shift, 'shift-info');
    XLSX.utils.book_append_sheet(wb, position, 'position-info');
    XLSX.utils.book_append_sheet(wb, personal, 'personal-info');
    XLSX.utils.book_append_sheet(wb, family, 'family-info');
    XLSX.utils.book_append_sheet(wb, comments, 'comments-info');
    /* save to file */
    XLSX.writeFile(wb, 'export-info.xlsx');
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
      'status', 'client', 'campaign',
      'manager', 'supervisor', 'trainer',
      'trainingGroupRef', 'hireDate', 'terminationDate',
      'reapplicant', 'reapplicantTimes'];
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
