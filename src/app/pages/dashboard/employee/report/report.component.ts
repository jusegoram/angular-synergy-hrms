import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { REPORTS } from '@synergy-app/shared/models/reports.constants';
import { noop } from 'rxjs';
import { OnSuccessAlertComponent } from '@synergy-app/shared/modals/on-success-alert/on-success-alert.component';
import { OnErrorAlertComponent } from '@synergy-app/shared/modals/on-error-alert/on-error-alert.component';
import { RangesFooterComponent } from '@synergy-app/shared/ranges-footer/ranges-footer.component';
import { ReportService } from '@synergy-app/pages/dashboard/employee/report/report.service';
import { EmployeeService } from '@synergy-app/shared/services/employee.service';

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
  reports = REPORTS.sort((a , b ) => a.name.localeCompare(b.name));
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
      if (!report.projection) {
        throw new Error('Woops');
      }
      const result = await this._reportService.getReport(report.projection, value, report.options).toPromise();
      return this.export(result);
    } catch (e) {
      this.reportForm.markAllAsTouched();
      await this.errorAlert.fire();
    }
  }
  async export(report: any) {
    const { reportSelector } = this.reportForm.value;
    try {
      if (report.length === 0) {
        throw new Error('Looks like the result came back empty, please check your filters');
      }
      this.wb = XLSX.utils.book_new();
      reportSelector.projection === 'shift' ?
        report = await this._reportService.mapShift(report) : noop();
      reportSelector.projection === 'hours' ?
        report = await this._reportService.mapHours(report) : noop();
      const sheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(report);
      XLSX.utils.book_append_sheet(this.wb, sheet1, 'sheet 1');
      XLSX.writeFile(this.wb, reportSelector.name + '-' + moment().format('MM-DD-YYYY').toString() + '.xlsx');
      await this.successAlert.fire();
      return;
    } catch (e) {
      await this.errorAlert.fire();
      return;
    }
  }

  setCampaigns(event: any) {
    let currentCampaigns = [];
    event.forEach((i) => (currentCampaigns = [...currentCampaigns, ...i.campaigns]));
    this.campaigns = currentCampaigns;
  }

}
