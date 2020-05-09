import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PayrollService } from '../../services/payroll.service';

import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import * as moment from 'moment';
import { ExportBottomSheetComponent } from './export-bottom-sheet/export-bottom-sheet.component';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { TIME_VALUES } from '@synergy/environments/enviroment.common';
import { RangesFooterComponent } from '@synergy-app/shared/components';
import { OnSuccessAlertComponent, OnErrorAlertComponent } from '@synergy-app/shared/modals';

@Component({
  selector: 'app-manage',
  templateUrl: './new-payroll.component.html',
  styleUrls: ['./new-payroll.component.scss'],
})
export class NewPayrollComponent implements OnInit {
  @ViewChild('myTable', {static: false}) table: any;
  @ViewChild('successSwal') private successSwal: OnSuccessAlertComponent;
  @ViewChild('errorSwal') private errorSwal: OnErrorAlertComponent;

  rangesFooter = RangesFooterComponent;
  rows = [];
  ColumnMode = ColumnMode;

  payrollType = new FormControl('', [Validators.required]);
  dates = new FormControl('', [
    this.dateRange(moment().subtract(TIME_VALUES.TWENTY_ONE_DAYS, 'days'), moment()),
    Validators.required,
  ]);
  // toDate = new FormControl('', [this.dateMaximum(this.fromDate.value), Validators.required]);

  displayedColumns = ['employeeId'];
  hours: any[];
  chartDataSource: any;
  pieCharDataSource: any;
  chartObj: any;
  handler: any;
  constructor(
    private router: Router,
    private _payrollService: PayrollService,
    private _bottomSheet: MatBottomSheet,
    private _datePipe: DatePipe,
    private zone: NgZone
  ) {}

  ngOnInit() {}


  isValid() {
    return this.payrollType.valid && this.dates.valid;
  }

  loadPayrollType(payroll, dates) {
    const fromDate = moment(dates.begin).format('MM-DD-YYYY').toString();
    const toDate = moment(dates.end).format('MM-DD-YYYY').toString();
    this._payrollService.createPayroll(payroll, fromDate, toDate).subscribe((result: any) => {
      this.chartDataSource = this.mapChartData(result.stats);
      this.pieCharDataSource = this.mapPieCharData(result.payroll);
      this.rows = [...result.payroll];
    });
  }

  mapChartData(data) {
    if (!data || data.length === 0) {
      return;
    }
    const categories = data[0].categories.map((cat) => {
      return {label: this._datePipe.transform(new Date(cat), 'MM/dd/yyyy')};
    });
    const mapped = data.map((i) => {
      return {
        seriesname: i.seriesname.toUpperCase(),
        data: i.data,
      };
    });
    return {
      chart: {
        caption: 'Hours Records Client/Day',
        subcaption: 'UNIT: HOUR RECORDS',
        numbersuffix: '',
        showsum: '1',
        plottooltext: '$label has <b>$dataValue</b> records for $seriesName',
        theme: 'fusion',
        drawcrossline: '1',
        exportEnabled: '1',
      },
      categories: [
        {
          category: [...categories],
        },
      ],
      dataset: mapped,
    };
  }

  mapPieCharData(data) {
    const clientSet = new Set(data.map((i) => i.employeeCompany.client));
    const returnData = [];
    clientSet.forEach((client: string) => {
      const value = data.filter((i) => i.employeeCompany.client === client);
      returnData.push({
        label: client.toUpperCase(),
        value: value.length,
      });
    });
    return {
      chart: {
        caption: 'Total Bi-Weekly Employees',
        centerLabelBold: '1',
        showpercentvalues: '0',
        defaultCenterLabel: 'Total B/W Employees: ' + data.length,
        aligncaptionwithcanvas: '0',
        captionpadding: '0',
        decimals: '1',
        plottooltext: '<b>$percentValue</b> of Employees are on <b>$label</b>',
        centerlabel: '$label |$value',
        theme: 'fusion',
        exportEnabled: '1',
      },
      data: [...returnData],
    };
  }

  dataplotClickHandler() {
    this.zone.run(() => {
      // TODO: can filter the array based on what is picked for future feature.
    });
  }
  initialized($event) {
    this.chartObj = $event.chart;
    this.attachEvent();
  }
  attachEvent() {
    this.handler = this.dataplotClickHandler.bind(this);
    this.chartObj.addEventListener('dataplotClick', this.handler);
  }

  dateRange(fromDate: moment.Moment, toDate: moment.Moment): ValidatorFn {
    const FORMAT_DATE = 'DD/MM/YYYY';
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      }
      const beginDate = moment(control.value.begin, FORMAT_DATE);
      const endDate = moment(control.value.end, FORMAT_DATE);
      if (!beginDate.isValid() && !endDate.isValid()) {
        return null;
      }

      return beginDate.isAfter(fromDate) && endDate.isBefore(toDate)
        ? null
        : {
          'date-range': {
            'date-range': fromDate.format(FORMAT_DATE),
            actual: beginDate.format(FORMAT_DATE),
          },
        };
    };
  }

  async saveToDatabase(payroll, dates) {
    const createdBy = this._payrollService.getUser(),
      fromDate = moment(dates.begin).toDate(),
      toDate = moment(dates.end).toDate();
    try {
      await this._payrollService
        .savePayroll({
          fromDate: fromDate,
          toDate: toDate,
          createdBy: createdBy,
          type: payroll[0].payrollType,
        }).toPromise();
      this.router.navigate(['payroll', 'main']);
      await this.successSwal.fire();
    } catch (e) {
      await this.errorSwal.fire();
    }
  }
  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
  }

  // saveConcepts(){
  //   if(this.otherpay.length > 0){
  //     let id = this.otherpay.map(i => i._id);
  //     let opts = {
  //       type: 'otherpayments',
  //       id: id,
  //       query: {
  //         payed: true
  //       }
  //     }
  //     this._payrollService.updateConcept(opts).subscribe(res => {});
  //   }
  //   if(this.deductions.length > 0){
  //     let id = this.deductions.map(i => i._id);
  //     let opts = {
  //       type: 'deduction',
  //       id: id,
  //       query: {
  //         payed: true
  //       }
  //     }
  //     this._payrollService.updateConcept(opts).subscribe(res => {});
  //   }
  // }
  clearTable() {
    this.rows = [];
  }

  openExportBottomSheet() {
    this._bottomSheet.open(ExportBottomSheetComponent);
  }
}
