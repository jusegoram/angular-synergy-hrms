import { DatePipe } from '@angular/common';
import { MinuteSecondsPipe } from './../../../shared/pipes/minute-seconds.pipe';
import { PayrollRow } from './PayrollRow';
import { PayrollService } from '../../services/payroll.service';

import {
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, NgZone } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { Payroll } from './Payroll';
import { ExportBottomSheetComponent } from './export-bottom-sheet/export-bottom-sheet.component';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  @ViewChild('myTable', { static: false }) table: any;

  socialSecurityTable: any[];

  // Make Holiday interface for saving in database.
  rows = [];
  ColumnMode = ColumnMode;

  payrollType = new FormControl('', [Validators.required]);
  fromDate = new FormControl('', [
    this.dateMinimum(moment().add(-21, 'days')),
    Validators.required
  ]);
  toDate = new FormControl('', [
    this.dateMaximum(this.fromDate.value),
    Validators.required
  ]);
  holidays = [];
  lastPayrollSettings: any;
  currentPayrollSettings: any;
  socialTableDisplayedColumns: string[] = [];
  displayedColumns = ['employeeId'];
  calculating = false;
  hours: any[];
  overtime: any[];
  bonus: any[];
  deductions: any[];
  otherpay: any[];
  chartDataSource: any;
  pieCharDataSource: any;
  chartObj: any;
  handler: any;
  selectedOnChart = [];
  constructor(
    private _payrollService: PayrollService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet,
    private minuteSeconds: MinuteSecondsPipe,
    private _datePipe: DatePipe,
    private zone: NgZone
  ) {}

  ngOnInit() {
  }

  dateFilterFrom = (d: Date): boolean => {
    let statement = true;
    switch (this.payrollType.value) {
      case 'BI-WEEKLY':
        const day = d.getDay();
          // Prevent Saturday and Sunday from being selected.
        statement = day === 1;
        break;
      case 'SEMIMONTHLY':
        statement = true;
        break;
      default:
        statement = false;
        break;
    }
    return statement;
  }

  dateFilterTo = (d: Date): boolean => {
    let statement = true;
    switch (this.payrollType.value) {
      case 'BI-WEEKLY':
        const day = d.getDay();
          // Prevent Saturday and Sunday from being selected.
        statement = day === 0;
        break;
      case 'SEMIMONTHLY':
        statement = true;
        break;
      default:
        statement = false;
        break;
    }
    return statement;
  }

  isValid() {
    console.log('executed');
    return this.payrollType.valid && this.fromDate.valid && this.toDate.valid;
  }

  // loadOtherPayrollInfo(payroll, from, to) {
  //   return new Promise((resolve, reject) => {
  //     const employeeIds = this._payrollService.payroll.employees.map(
  //       i => i.employee
  //     );
  //     this._payrollService
  //       .getOtherPayrollInfo(employeeIds, payroll, from, to)
  //       .subscribe((result: any[]) => {
  //         this.hours = result[0];
  //         this.bonus = result[1];
  //         this.deductions = result[2];
  //         this.otherpay = result[3];
  //         const debouncedHours = this.debounce(
  //           () => {
  //             this._payrollService.payroll.joinEmployee(this.hours, 'hours');
  //           },
  //           100,
  //           true
  //         );
  //         const debouncedBonus = this.debounce(
  //           () => {
  //             this._payrollService.payroll.joinEmployee(this.bonus, 'bonus');
  //           },
  //           100,
  //           true
  //         );
  //         const debouncedDeductions = this.debounce(
  //           () => {
  //             this._payrollService.payroll.joinEmployee(
  //               this.deductions,
  //               'deductions'
  //             );
  //           },
  //           100,
  //           true
  //         );
  //         const debouncedOtherpay = this.debounce(
  //           () => {
  //             this._payrollService.payroll.joinEmployee(
  //               this.otherpay,
  //               'otherpay'
  //             );
  //           },
  //           100,
  //           true
  //         );
  //         debouncedHours();
  //         debouncedBonus();
  //         debouncedDeductions();
  //         debouncedOtherpay();
  //         setTimeout(() => {
  //           resolve();
  //         }, 500);
  //       });
  //   });
  // }

  loadPayrollType(payroll, from: Date, to: Date) {
    const fromDate = moment(from).format('MM-DD-YYYY').toString();
    const toDate = moment(to).format('MM-DD-YYYY').toString();
    this._payrollService
      .getEmployeesByPayrollType(payroll, fromDate, toDate)
      .subscribe((result: any) => {
        this.chartDataSource = this.mapChartData(result.stats);
        this.pieCharDataSource = this.mapPieCharData(result.payroll);
        this.rows = [...result.payroll];

      });
  }

  mapChartData(data) {
    if (!data || data.length === 0) {
      return;
    }
    const categories = data[0].categories.map(cat => {
      return {label: this._datePipe.transform(new Date(cat), 'MM/dd/yyyy')};
    });
    const mapped = data.map(i => {
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
        plottooltext:
          '$label has <b>$dataValue</b> records for $seriesName',
        theme: 'fusion',
        drawcrossline: '1',
        exportEnabled: '1'

      },
      categories: [
        {
          category: [
            ...categories
          ]
        }
      ],
      dataset: mapped
    };
  }

  mapPieCharData(data) {
    const clientSet = new Set(data.map(i => i.employeeCompany.client));
    const returnData = [];
    clientSet.forEach((client: string) => {
      const value = data.filter(i => i.employeeCompany.client === client);
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
        plottooltext:
          '<b>$percentValue</b> of Employees are on <b>$label</b>',
        centerlabel: '$label |$value',
        theme: 'fusion',
        exportEnabled: '1'

      },
      data: [
       ...returnData
      ]
    };
  }

  dataplotClickHandler(e) {
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


  // onLoadBonus(e) {
  //   const files = e.target.files,
  //     f = files[0];
  //   const reader = new FileReader();
  //   let jsonSheet;
  //   reader.onload = (file: any) => {
  //     const data = new Uint8Array(file.target.result);
  //     const workbook = XLSX.read(data, { type: 'array' });

  //     const first_sheet_name = workbook.SheetNames[0];

  //     const worksheet = workbook.Sheets[first_sheet_name];
  //     jsonSheet = XLSX.utils.sheet_to_json(worksheet, {
  //       raw: true
  //     });
  //   };
  //   reader.readAsArrayBuffer(f);
  //   setTimeout(() => {
  //     this.populateTable(
  //       this._payrollService.payroll.joinEmployee(jsonSheet, 'bonus')
  //     );
  //   }, 500);
  // }

  dateMinimum(date: moment.Moment): ValidatorFn {
    const FORMAT_DATE = 'DD/MM/YYYY';
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) { return null; }

      const controlDate = moment(control.value, FORMAT_DATE);
      if (!controlDate.isValid()) { return null; }

      const validationDate = date;
      return controlDate.isAfter(validationDate)
        ? null
        : {
            'date-minimum': {
              'date-minimum': validationDate.format(FORMAT_DATE),
              actual: controlDate.format(FORMAT_DATE)
            }
          };
    };
  }

  dateMaximum(date: string): ValidatorFn {
    const FORMAT_DATE = 'DD/MM/YYYY';
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) { return null; }

      const controlDate = moment(control.value, FORMAT_DATE);
      if (!controlDate.isValid()) { return null; }

      const validationDate = moment(this.fromDate.value, FORMAT_DATE).add(
        7,
        'days'
      );
      return controlDate.isBefore(validationDate)
        ? null
        : {
            'date-max': {
              'date-max': validationDate.format(FORMAT_DATE),
              actual: controlDate.format(FORMAT_DATE)
            }
          };
    };
  }

  saveToDatabase(payroll, from, to) {
    const
      createdBy = this._payrollService.getUser(),
      fromDate = moment(from).toDate(),
      toDate = moment(to).toDate();
    this._payrollService.savePayroll({fromDate: fromDate, toDate: toDate, createdBy: createdBy, type: payroll[0].payrollType}).subscribe(
      result => {
        console.log(result);
      },
      err => {
        console.log(err);
      }
    );
  }
  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
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
