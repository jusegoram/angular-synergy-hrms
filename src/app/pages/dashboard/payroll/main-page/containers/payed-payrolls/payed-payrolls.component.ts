import { MinuteSecondsPipe } from '@synergy-app/shared/pipes/minute-seconds.pipe';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { ChartData, Datum } from '@synergy-app/shared/models/chart-data.model';
import { PayslipDialogComponent } from '@synergy-app/shared/modals';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-payed-payrolls',
  templateUrl: './payed-payrolls.component.html',
  styleUrls: ['./payed-payrolls.component.scss'],
})
export class PayedPayrollsComponent implements OnInit {
  @Input() type;
  wb: XLSX.WorkBook;
  rows = [];
  columns = [];
  selected = [];
  selectedClient = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  statsRows = [];
  statsColumns = [
    { name: 'CONCEPT', prop: 'concept' },
    { name: 'AMOUNT', prop: 'amount' },
  ];
  tableMessages = {
    emptyMessage: 'PLEASE CLICK ON A PAYROLL RUN TO LOAD THE STATS',
  };
  clientStatsRows = [];
  clientStatsColumns = [
    { name: 'CONCEPT', prop: 'concept' },
    { name: 'AMOUNT', prop: 'amount' },
  ];
  clientTableMessages = {
    emptyMessage: 'PLEASE CLICK ON A CLIENT IN THE CHART TO LOAD THIS TABLE',
  };
  doughnutChartData: any;
  clientStats: any;
  exportInfo: any[];
  constructor(
    private currency: CurrencyPipe,
    private _datePipe: DatePipe,
    private _payrollService: PayrollService,
    private _minuteSeconds: MinuteSecondsPipe,
    private snackBar: MatSnackBar,
    private zone: NgZone,
    public dialog: MatDialog
  ) {
    this.columns = [
      { name: 'PAY RUN DATE', prop: 'paymentDate', pipe: this.datePipe() },
      { name: 'FROM DATE', prop: 'fromDate', pipe: this.datePipe() },
      { name: 'TO DATE', prop: 'toDate', pipe: this.datePipe() },
      { name: 'EMPLOYEES', prop: 'employeesAmount' },
      {
        name: 'TOTAL NET',
        prop: 'totalPayed.$numberDecimal',
        pipe: this.currency,
      },
      {
        name: 'RCC SOCIAL CON.',
        prop: 'totalCompanyContributions.$numberDecimal',
        pipe: this.currency,
      },
      {
        name: 'TOTAL TAXES',
        prop: 'totalTaxes.$numberDecimal',
        pipe: this.currency,
      },
    ];
  }

  ngOnInit() {
    this.wb = XLSX.utils.book_new();
    this.loadPayedPayrolls();
  }

  datePipe() {
    return {
      transform: (value) => this._datePipe.transform(value, 'MM/dd/yyyy'),
    };
  }

  loadPayedPayrolls() {
    this._payrollService.getPayroll('', '', '', true).subscribe((result) => {
      this.rows = result;
    });
  }
  export() {
    const result = this.exportInfo;
    const data = result.map((i) => {
      return {
        employeeId: i.employeeId,
        firstName: i.firstName,
        middleName: i.middleName,
        lastName: i.lastName,
        employeeName: i.employeeName,
        onFinalPayment: i.onFinalPayment,
        employeeSSN: i.employeeSSN,
        employeeStatus: i.employeeStatus,
        employeeEmail: i.employeeEmail,
        client: i.employeeCompany.client,
        campaign: i.employeeCompany.campaign,
        hireDate: i.employeeCompany.hireDate,
        billable: i.employeePayroll.billable,
        bankAccount: i.employeePayroll.bankAccount,
        bankName: i.employeePayroll.bankName,
        TIN: i.employeePayroll.TIN,
        positionHourlyRate: i.positionHourlyRate['$numberDecimal'],
        payrollType: i.payrollType,
        positionName: i.positionName,
        positionId: i.positionId,
        positionBaseWage: i.positionBaseWage,
        totalScheduledMinutes: i.totalScheduledMinutes,
        totalDeductions: i.totalDeductions['$numberDecimal'],
        totalOtherPays: i.totalOtherPays['$numberDecimal'],
        totalMaternities: i.totalMaternities['$numberDecimal'],
        totalCSL: i.totalCSL['$numberDecimal'],
        totalTaxableBonus: i.totalTaxableBonus['$numberDecimal'],
        totalNonTaxableBonus: i.totalNonTaxableBonus['$numberDecimal'],
        totalFinalPayments: i.totalFinalPayments['$numberDecimal'],
        totalOvertimeHours: i.totalOvertimePayHours,
        totalSystemRegularHours: i.totalSystemRegularPayHours,
        totalTrainingRegularHours: i.totalTrainingRegularPayHours,
        totalTosRegularHours: i.totalTosRegularPayHours,
        totalSystemHolidayX1Hours: i.totalSystemHolidayX1PayHours,
        totalTrainingHolidayX1Hours: i.totalTrainingHolidayX1PayHours,
        totalTosHolidayX1Hours: i.totalTosHolidayX1PayHours,
        totalSystemHolidayX2Hours: i.totalSystemHolidayX2PayHours,
        totalTrainingHolidayX2Hours: i.totalTrainingHolidayX2PayHours,
        totalTosHolidayX2Hours: i.totalTosHolidayX2PayHours,
        taxableGross: i.grossBeforeCSLPayment['$numberDecimal'],
        completeGross: i.grossPayment['$numberDecimal'],
        ssEmployeeContribution: i.ssEmployeeContribution['$numberDecimal'],
        ssEmployerContribution: i.ssEmployerContribution['$numberDecimal'],
        incomeTax: i.incomeTax['$numberDecimal'],
        netPayment: i.netPayment['$numberDecimal'],
      };
    });
    const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(this.wb, main, 'sheet 1');
    const date = moment().format('MM-DD-YYYY HH:mm:ss').toString();
    XLSX.writeFile(this.wb, `payroll-${date}.xlsx`);
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    if (selected.length === 1) {
      this.loadStats(selected[0]);
    } else if (selected.length === 0) {
      this.statsRows = [];
      this.clientStatsRows = [];
      delete this.doughnutChartData;
    }
  }
  loadStats(row) {
    this.statsRows = this.mapTotalStats(row);
    this._payrollService.getPayrollRun(row._id).subscribe((result: any) => {
      this.initCharts(result.stats);
      this.clientStats = result.stats;
      this.exportInfo = result.details;
    });
  }
  mapTotalStats(data) {
    const stats = JSON.parse(JSON.stringify(data));
    delete stats._id;
    delete stats.payrolls;
    delete stats.employees;
    stats.fromDate = this.datePipe().transform(stats.fromDate);
    stats.toDate = this.datePipe().transform(stats.toDate);
    stats.paymentDate = this.datePipe().transform(stats.paymentDate);
    stats.campaigns = stats.campaigns.length;
    const returnedArr = Object.keys(stats).map((key, index) => {
      const totalsRegexTest = new RegExp('total');
      const hoursTest = new RegExp('totalRegularHours|totalOvertimeHours|totalHolidayHoursX2|totalHolidayHoursX1');
      const payTest = new RegExp('Pay');
      const result = key.replace(/([A-Z])/g, ' $1');
      const finalName = result.charAt(0).toUpperCase() + result.slice(1);
      if (totalsRegexTest.test(key)) {
        if (hoursTest.test(key)) {
          if (payTest.test(key)) {
            return {
              concept: finalName,
              amount: this.currency.transform(stats[key]['$numberDecimal'] ? stats[key]['$numberDecimal'] : stats[key]),
            };
          } else {
            return {
              concept: finalName,
              amount: this._minuteSeconds.transform(stats[key]),
            };
          }
        } else {
          return {
            concept: finalName,
            amount: this.currency.transform(stats[key]['$numberDecimal'] ? stats[key]['$numberDecimal'] : stats[key]),
          };
        }
      } else {
        return {
          concept: finalName,
          amount: stats[key],
        };
      }
    });

    return returnedArr.sort((a, b) => a.concept.localeCompare(b.concept));
  }
  dataplotClickHandler(e) {
    this.zone.run(() => {
      if (this.selectedClient.indexOf(e.dataObj.categoryLabel) !== -1) {
        this.selectedClient.splice(0, this.selectedClient.length);
      } else {
        if (this.selectedClient.length === 1) {
          this.selectedClient = [];
        }
        this.selectedClient.push(e.dataObj.categoryLabel);
      }
      if (this.selectedClient.length === 1) {
        const [clientStats] = this.clientStats.filter((c) => c._id.client === this.selectedClient[0]);
        this.clientStatsColumns = [
          { name: this.selectedClient[0].toUpperCase(), prop: 'concept' },
          { name: 'AMOUNT', prop: 'amount' },
        ];
        this.clientStatsRows = this.mapTotalStats(clientStats);
      }
    });
  }
  initCharts(stats) {
    this.doughnutChartData = new ChartData(
      {
        caption: 'PAYROLL RUN CLIENT DISTRIBUTION',
        subCaption: 'For employees in the payroll run',
        defaultcenterlabel: 'RCC BPO',
        aligncaptionwithcanvas: '0',
        captionpadding: '0',
        decimals: '1',
        plottooltext: '<b>$percentValue</b> of our employees are on <b>$label</b>',
        centerlabel: '$value',
        theme: 'fusion',
        exportenabled: '1',
        exportfilename: 'payrollDoughnutChart1',
      },
      this.mapDoughNutChartData(stats, 'client', '', 'employeesAmount')
    );
  }
  mapDoughNutChartData(data, labelPath, labelPath2, valuePath): Datum[] {
    let mappedData: Datum[];
    mappedData = data.map((item) => {
      let label;
      if (labelPath === 'client' && labelPath2 === '') {
        label = item._id.client;
      } else {
        label = item[labelPath] + ' - ' + item[labelPath2];
      }
      return {
        label: label,
        value: item[valuePath],
      };
    });
    return mappedData;
  }

  openPayslipDialog() {
    const payslipDialogRef = this.dialog.open(PayslipDialogComponent, {
      width: '500px',
      data: this.exportInfo,
    });
  }
}
