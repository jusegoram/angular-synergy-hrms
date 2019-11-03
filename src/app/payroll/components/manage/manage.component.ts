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
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSnackBar, MatBottomSheet } from '@angular/material';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { Payroll } from './Payroll';
import { ExportBottomSheetComponent } from './export-bottom-sheet/export-bottom-sheet.component';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  socialSecurityTable: any[];

  // Make Holiday interface for saving in database.
  dataSource: any;
  payrollSettings: any[];
  payrollType = new FormControl('', [Validators.required]);
  fromDate = new FormControl('', [this.dateMinimum(moment().add(-10, 'days')), Validators.required]);
  toDate = new FormControl('', [this.dateMaximum(this.fromDate.value), Validators.required]);
  holidays = [];
  lastPayrollSettings: any;
  currentPayrollSettings: any;
  dataSourceSocialTable: any;
  socialTableDisplayedColumns: string[] = [];
  displayedColumns = ['employeeId'];
  calculating = false;
  constructor(
    private _payrollService: PayrollService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet,
    private minuteSeconds : MinuteSecondsPipe,
  ) {}

  ngOnInit() {

  }

  isValid(){
      console.log('executed')
      return this.payrollType.valid && this.fromDate.valid && this.toDate.valid;
  }
  populateTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSourceSocialTable = new MatTableDataSource(
      this._payrollService.payroll.socialTable
    );
    this.socialTableDisplayedColumns = [
      'earnings',
      'employeeDeductions',
      'employerDeductions',
      'totalContributions'
    ];
  }
  loadOtherPayrollInfo(payroll, from, to) {
    return new Promise((resolve, reject) => {
      const employeeIds = this._payrollService.payroll.employees.map(
        i => i.employee
      );
      this._payrollService
        .getOtherPayrollInfo(employeeIds, payroll, from, to)
        .subscribe((result: any[]) => {
          const hours = result[0];
          const overtime = result[1];
          const bonus = result[2];
          const deductions = result[3];
          const otherpay = [4];

          this._payrollService.payroll.joinEmployee(hours, 'hours');
          this._payrollService.payroll.joinEmployee(overtime, 'overtime');
          this._payrollService.payroll.joinEmployee(bonus, 'bonus');
          this._payrollService.payroll.joinEmployee(deductions, 'deductions');
          this._payrollService.payroll.joinEmployee(otherpay, 'otherpay');
          setTimeout(() => {
            resolve();
          }, 500)
        });
    })
  }
  loadPayrollType(payroll, from, to) {
    this._payrollService
      .getEmployeesByPayrollType(payroll, from, to)
      .subscribe((result: PayrollRow[]) => {
        this._payrollService.setPayroll(
          result,
          this.fromDate.value,
          this.toDate.value,
          this.payrollSettings[0],
          this.payrollSettings[1],
          this.payrollSettings[2],
          this.payrollSettings[3],
          this.payrollSettings[4],
          this.payrollSettings[5]
        );
        this.populateTable(this._payrollService.payroll.employees);
      });
  }
  loadSettings(from, to) {
    this._payrollService.getPayrollSettings(from, to).subscribe(result => {
      this.payrollSettings = result;
    });
  }
  onLoadBonus(e) {
    const files = e.target.files,
      f = files[0];
    const reader = new FileReader();
    let jsonSheet;
    reader.onload = (file: any) => {
      const data = new Uint8Array(file.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const first_sheet_name = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[first_sheet_name];
      jsonSheet = XLSX.utils.sheet_to_json(worksheet, {
        raw: true
      });
    };
    reader.readAsArrayBuffer(f);
    setTimeout(() => {
      this.populateTable(
        this._payrollService.payroll.joinEmployee(jsonSheet, 'bonus')
      );
    }, 500);
  }

  onLoadDeductions(e) {
    const files = e.target.files,
      f = files[0];
    const reader = new FileReader();
    let jsonSheet;
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const first_sheet_name = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[first_sheet_name];
      jsonSheet = XLSX.utils.sheet_to_json(worksheet, {
        raw: true
      });
    };
    reader.readAsArrayBuffer(f);
    setTimeout(() => {
      this.populateTable(
        this._payrollService.payroll.joinEmployee(jsonSheet, 'deductions')
      );
    }, 500);
  }

  dateMinimum(date: moment.Moment): ValidatorFn {
    const FORMAT_DATE = 'DD/MM/YYYY';
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) return null;

      const controlDate = moment(control.value, FORMAT_DATE);
      if (!controlDate.isValid()) return null;

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
      if (control.value == null) return null;

      const controlDate = moment(control.value, FORMAT_DATE);
      if (!controlDate.isValid()) return null;

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

  calculatePayroll() {
    this.loadOtherPayrollInfo(this.payrollType.value, this.fromDate.value, this.toDate.value).then(finished => {
      this._payrollService.payroll.calculatePayroll();
      this.calculating = this._payrollService.payroll.onCalculating();
    }).catch(err => {
    })
  }

  saveToDatabase(payroll) {
    this._payrollService.savePayroll().subscribe(result => {
      this.snackBar.open('Payroll was saved correctly', 'thank you', {
        duration: 2000
      });

    }, err => {
      this.snackBar.open('There was an error saving payroll', 'I will notify IT', {
        duration: 5000
      });
    });
  }

  clearTable() {
    this.dataSource = null;
    delete this.dataSource;
    this._payrollService.deletePayroll();
  }

  openExportBottomSheet(){
      this._bottomSheet.open(ExportBottomSheetComponent);
  }
}
