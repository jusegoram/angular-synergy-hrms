import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import * as moment from 'moment';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { TIME_VALUES } from '@synergy/environments/enviroment.common';
import { RangesFooterComponent, ExportBottomSheetComponent } from '@synergy-app/shared/components';
import { OnSuccessAlertComponent, OnErrorAlertComponent } from '@synergy-app/shared/modals';

@Component({
  selector: 'app-manage',
  templateUrl: './new-payroll-page.component.html',
  styleUrls: ['./new-payroll-page.component.scss'],
})
export class NewPayrollPageComponent implements OnInit {
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

  clearTable() {
    this.rows = [];
  }

  openExportBottomSheet() {
    const exportData = this.rows.map( i =>  {
      return {
        fromDate: i.fromDate,
        toDate: i.toDate,
        employeeId: i.employeeId,
        employeeName: i.employeeName,
        status: i.employeeStatus,
        employeeSSN: i.employeeSSN,
        client: i.employeeCompany.client,
        campaign: i.employeeCompany.campaign,
        manager: i.employeeCompany.manager.name,
        supervisor: i.employeeCompany.supervisor.name,
        branch: i.employeeCompany.branch,
        trainingGroup: [i.employeeCompany.trainingGroupRef, i.employeeCompany.trainingGroupNum].join(' '),
        hireDate: i.employeeCompany.hireDate,
        terminationDate: i.employeeCompany.terminationDate,
        email: i.email,
        TIN: i.employeePayroll.TIN,
        payrollType: i.employeePayroll.payrollType,
        bankName: i.employeePayroll.bankName,
        bankAccount: i.employeePayroll.bankAccount,
        billable: i.employeePayroll.billable,
        paymentType: i.employeePayroll.paymentType,
        position: i.employeePosition.name,
        baseWage: i.positionBaseWage,
        hourlyRate: i.positionBaseWage * 12 / 52 / 45,
        totalScheduledMinutes: i.totalScheduledMinutes,
        daysInShiftHolidayX1: i.employeeShiftHolidayX1.length || 0,
        daysInShiftHolidayX2: i.employeeShiftHolidayX2.length || 0,
        daysInShiftRegular: i.employeeShiftRegular.length || 0,
        employeeOtherpays_Records: i.employeeOtherpays.length || 0,
        employeeCSL_Records: i.employeeCSL.length || 0,
        employeeCompassionate_Records: i.employeeCompassionate.length || 0,
        employeeMaternities_Records: i.employeeMaternities.length || 0,
        employeeFinalPayments_Records: i.employeeFinalPayments.length || 0,
        employeeTaxableBonus_Records: i.employeeTaxableBonus.length || 0,
        employeeNonTaxableBonus_Records: i.employeeNonTaxableBonus.length || 0,
        employeeDeductions_Records: i.employeeDeductions.length || 0,
        totalSystemHoursRegular: i.totalSystemRegularPay.hours || 0,
        totalSystemRegularPay: i.totalSystemRegularPay.totalPayed['$numberDecimal'],
        totalSystemHoursHolidayX1: i.totalSystemHolidayX1Pay.hours || 0,
        totalSystemHolidayX1Pay: i.totalSystemHolidayX1Pay.totalPayed['$numberDecimal'],
        totalSystemHoursHolidayX2: i.totalSystemHolidayX2Pay.hours || 0,
        totalSystemHolidayX2Pay: i.totalSystemHolidayX2Pay.totalPayed['$numberDecimal'],
        totalTosHoursRegular: i.totalTosRegularPay.hours || 0,
        totalTosRegularPay: i.totalTosRegularPay.totalPayed['$numberDecimal'],
        totalTosHoursHolidayX1: i.totalTosHolidayX1Pay.hours || 0,
        totalTosHolidayX1Pay: i.totalTosHolidayX1Pay.totalPayed['$numberDecimal'],
        totalTosHoursHolidayX2: i.totalTosHolidayX2Pay.hours || 0,
        totalTosHolidayX2Pay: i.totalTosHolidayX2Pay.totalPayed['$numberDecimal'],
        totalOtherPays: i.totalOtherPays['$numberDecimal'],
        totalCSL: i.totalCSL['$numberDecimal'],
        totalCompassionate: i.totalCompassionate['$numberDecimal'],
        totalMaternities: i.totalMaternities['$numberDecimal'],
        totalFinalPayments: i.totalFinalPayments['$numberDecimal'],
        totalTaxableBonus: i.totalTaxableBonus['$numberDecimal'],
        totalNonTaxableBonus: i.totalNonTaxableBonus['$numberDecimal'],
        totalDeductions: i.totalDeductions['$numberDecimal'],
        totalOvertime: i.totalOvertime,
        totalOvertimePay: i.totalOvertimePay['$numberDecimal'],
        ssEmployeeContribution: i.ssEmployeeContribution['$numberDecimal'],
        ssEmployerContribution: i.ssEmployerContribution['$numberDecimal'],
        socialContribution: i.socialContribution['$numberDecimal'],
        grossBeforeCSLPayment: i.grossBeforeCSLPayment['$numberDecimal'],
        grossPayment: i.grossPayment['$numberDecimal'],
        incomeTax: i.incomeTax['$numberDecimal'],
        netPayment: i.netPayment['$numberDecimal'],
        isFinalized: i.isFinalized,
        isPayed: i.isPayed,
        onFinalPayment: i.onFinalPayment,
      };
    });
    this._bottomSheet.open(ExportBottomSheetComponent, {data: exportData});
  }
}
