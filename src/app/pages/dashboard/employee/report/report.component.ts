import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import * as XLSX from 'xlsx';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { RangesFooterComponent } from '../../shared/ranges-footer/ranges-footer.component';
import { TIME_VALUES } from '../../../environments/enviroment.common';
import { ReportService } from '@synergy-app/employee/report/report.service';
import { REPORTS } from '@synergy-app/shared/models/reports.constants';
import { noop } from 'rxjs';
import { OnSuccessAlertComponent } from '@synergy-app/shared/modals/on-success-alert/on-success-alert.component';
import { OnErrorAlertComponent } from '@synergy-app/shared/modals/on-error-alert/on-error-alert.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  @ViewChild('successAlert', { static: false })
  successAlert: OnSuccessAlertComponent;
  @ViewChild('errorAlert', { static: false })
  errorAlert: OnErrorAlertComponent;
  errorMessage = 'Woops, looks like your search came back empty. Please check the filters';
  successMessage = 'Great! The download is starting.';
  rangesFooter = RangesFooterComponent;
  private auth: any;
  reports = REPORTS;
  data: any;
  clients: any[];
  campaigns: any[];
  status: any[];
  superiors: any;
  dataSource: any;
  reportForm: FormGroup;
  queryForm: FormGroup;
  sheetControl: FormControl;
  displayedColumns = [];
  wb: XLSX.WorkBook;
  selectedTab = 0;
  avatarQuery = {
    reportType: 'avatar',
    employeeStatus: 'active',
  };
  mainQuery = {
    reportType: 'main',
    employeeStatus: 'active',
  };
  companyQuery = {
    reportType: 'company',
    employeeStatus: 'active',
  };
  shiftQuery = {
    reportType: 'shift',
    employeeStatus: 'active',
  };
  positionQuery = {
    reportType: 'position',
    employeeStatus: 'active',
  };
  payrollQuery = {
    reportType: 'payroll',
    employeeStatus: 'active',
  };
  personalQuery = {
    reportType: 'personal',
    employeeStatus: 'active',
  };
  familyQuery = {
    reportType: 'family',
    employeeStatus: 'active',
  };

  constructor(private _reportService: ReportService, private _service: EmployeeService, private fb: FormBuilder) {
    this.clients = [];
    this.campaigns = [];
    this.status = this._service.status;
  }

  async ngOnInit() {
    this.auth = this._service.getDecodedToken();
    this.buildForm();
    try {
      this.clients = await this._service.getClient(this.auth.clients).toPromise();
      this.superiors = await this._service.getEmployeeManagers(this.auth.clients).toPromise();
    } catch (e) {
      return;
    }
  }

  onFilterRemoved(item: string, control?: string) {
    const items = this.queryForm.controls[control].value as string[];
    this.removeFirst(items, item);
    this.queryForm.controls[control].setValue(items); // To trigger change detection
  }

  removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  buildForm() {
    this.reportForm = this.fb.group({
      hireDateCheck: [false],
      terminationDateCheck: [false],
      reportSelector: [Validators.required],
    });

    this.queryForm = this.fb.group({
      status: [],
      client: [],
      campaign: [],
      manager: [],
      shiftManager: [],
      supervisor: [],
      trainer: [],
      hireDate: [],
      terminationDate: [],
      trainingGroupRef: ['GEN'],
      trainingGroupNum: [],
    });

    this.sheetControl = new FormControl();
  }

  async getReport() {
    const { value } = this.queryForm;
    const { reportSelector: report } = this.reportForm.value;
    try {
      const result = await this._reportService.getReport(report.projection, value, report.options).toPromise();
      return this.export(result);
    } catch (e) {
      this.reportForm.markAllAsTouched();
      this.errorAlert.fire();
    }
  }
  export(report: any) {
    const { reportSelector } = this.reportForm.value;
    try {
      if (report.length === 0) {
        throw new Error('Looks like the result came back empty, please check your filters');
      }
      this.wb = XLSX.utils.book_new();
      if (reportSelector.projection === 'shift') {
        report = this.exportShift(report);
      }
      const sheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(report);
      XLSX.utils.book_append_sheet(this.wb, sheet1, 'sheet 1');
      XLSX.writeFile(this.wb, reportSelector.name + '-' + moment().format('MM-DD-YYYY').toString() + '.xlsx');
      this.successAlert.fire();
    } catch (e) {
      this.errorAlert.fire();
    }
  }
  exportShift(report) {
    let returned = [];
    returned = report.map((element) => {
      const { shift } = element;
      const exportShift: any = {};
      if (shift) {
        console.log(shift);
        const length = shift.length;
        for (let i = 0; i < length; i++) {
          const day = shift[i];
          exportShift[moment(day.date).format('MM/DD/YYYY').toString()] = `${this.transformTime(
            day.shiftStartTime
          )} - ${this.transformTime(day.shiftEndTime)}`;
          if (exportShift[moment(day.date).format('MM/DD/YYYY').toString()] === '00:00 - 00:00') {
            exportShift[moment(day.date).format('MM/DD/YYYY').toString()] = 'DAY OFF';
          }
        }
      }
      return Object.assign(element, exportShift);
    });
    return returned;
  }
  setCampaigns(event: any) {
    let currentCampaigns = [];
    event.forEach((i) => (currentCampaigns = [...currentCampaigns, ...i.campaigns]));
    this.campaigns = currentCampaigns;
  }
  transformTime(param: any): string {
    let result = '00:00';
    if (param !== null) {
      if (param.toString().includes(':')) {
        return param;
      }
      const stored = parseInt(param, 10);
      const hours = Math.floor(stored / TIME_VALUES.SECONDS_PER_MINUTE);
      const minutes = stored - hours * TIME_VALUES.SECONDS_PER_MINUTE;
      let fixedMin = minutes === 0 ? '00' : minutes;
      minutes > 0 && minutes < 10 ? (fixedMin = '0' + minutes) : noop();
      result = hours + ':' + fixedMin;
      return result;
    } else {
      return result;
    }
  }
  tabChanged(event) {
    this.selectedTab = event.index;
  }

}
