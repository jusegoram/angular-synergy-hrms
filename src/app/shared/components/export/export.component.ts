import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OnSuccessAlertComponent, OnErrorAlertComponent } from '@synergy-app/shared/modals';
import { RangesFooterComponent } from '@synergy-app/shared/components/ranges-footer/ranges-footer.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { EmployeeService } from '@synergy-app/core/services';
import { noop } from 'rxjs';
import moment from 'moment';
import { ExportService } from '@synergy-app/shared/services/export.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  @Input() reports: any[];
  @ViewChild('successAlert', { static: false })
  successAlert: OnSuccessAlertComponent;
  @ViewChild('errorAlert', { static: false })
  errorAlert: OnErrorAlertComponent;
  errorMessage = 'Woops, looks like your search came back empty. Please check the filters';
  successMessage = 'Great! The download is starting.';
  rangesFooter = RangesFooterComponent;
  public auth: any;
  data: any;
  clients: any[];
  campaigns: any[];
  status: any[];
  superiors: any;
  dataSource: any;
  reportForm: FormGroup;
  queryForm: FormGroup;
  extrasForm: FormGroup;
  sheetControl: FormControl;
  displayedColumns = [];
  wb: XLSX.WorkBook;
  constructor(private _reportService: ExportService, private _service: EmployeeService, private fb: FormBuilder) {
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
      let extras = {};
      const { projection, options } = report;
      if (!projection) {
        throw new Error('Woops');
      }
      if (!!this.extrasForm) { extras = this.extrasForm.value; }
      const result = await this._reportService.getReport(projection, value, options, extras).toPromise();
      return this.export(result);
    } catch (e) {
      this.reportForm.markAllAsTouched();
      await this.errorAlert.fire();
    }
  }
  async export(report: any) {
    const { reportSelector } = this.reportForm.value;
    let result = report;
    try {
      if (report.length === 0) {
        throw new Error('Looks like the result came back empty, please check your filters');
      }
      this.wb = XLSX.utils.book_new();
        switch (reportSelector.projection) {
          case 'shift': result = await this._reportService.mapShift(report);
          break;
          case  'hours': result = await this._reportService.mapHours(report);
          break;
        }
      const sheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(result);
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
