import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { EditPayrollDetailComponent } from './containers/edit-payroll-detail/edit-payroll-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { MinuteSecondsPipe } from '@synergy-app/shared/pipes/minute-seconds.pipe';
import { MatTableDataSource } from '@angular/material/table';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { MatStepper } from '@angular/material/stepper';
import { noop } from 'rxjs';
import { ChartData, Datum } from '@synergy-app/shared/models/chart-data.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ExportBottomSheetComponent } from '@synergy-app/shared/components';

@Component({
  selector: 'app-detail',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  @ViewChild('myTable', {static: false}) table: any;
  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  @ViewChild('failedFinalizeSwal', {static: false})
  failedFinalizeSwal: SwalComponent;

  rows = [];
  ColumnMode = ColumnMode;
  resolvedData: any;
  stats: any[];
  payroll: any;
  doughnutChartData: ChartData;
  barChartData: ChartData;
  width = '100%';
  height = '100%';
  widthBar = '100%';
  heightBar = '100%';
  type = 'doughnut2d';
  dataFormat = 'json';
  barChartSwitchableData: any[];
  totals: any;
  totalTableDataSource: any;
  clientTableDataSource: any;
  dataSource: any;
  filterItems: any;
  filterValue = '';
  user;

  constructor(
    private route: ActivatedRoute,
    private zone: NgZone,
    private minutesecondsPipe: MinuteSecondsPipe,
    private _payrollService: PayrollService,
    private matDialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
  ) {
    this.user = this._payrollService.getDecodedToken();
  }

  ngOnInit() {
    this.resolvedData = this.route.snapshot.data['payroll'];
    this.stats = this.resolvedData.stats;
    this.payroll = this.resolvedData.payroll;
    this.dataSource = new MatTableDataSource(this.payroll);
    this.rows = this.dataSource.data;
    this.filterItems = ['employeeId', 'employeeName', 'client', 'campaign'];
    this.barChartSwitchableData = this.mapBarChartData(this.stats);
    this.totals = this.calculateTotals(this.stats);
    this.totalTableDataSource = new MatTableDataSource(this.totals);
    this.initializeCharts();
  }
  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.rows = this.dataSource.filteredData;
  }

  dataplotClickHandler(eventObj) {
    const dataObj = eventObj.dataObj;
    this.zone.run(() => {
      this.barChartData.chart.caption = `${dataObj.categoryLabel}'s Financial Details`;
      this.barChartData.data = this.barDataSwitch(dataObj.categoryLabel);
      this.setClientTableData(dataObj.categoryLabel);
    });
  }

  initializeCharts() {
    this.doughnutChartData = new ChartData(
      {
        caption: 'Payroll Campaign Distribution Chart',
        subCaption: 'For employees in the current payroll',
        defaultcenterlabel: 'RCC BPO',
        aligncaptionwithcanvas: '0',
        captionpadding: '0',
        decimals: '1',
        plottooltext:
          '<b>$percentValue</b> of our employees are on <b>$label</b>',
        centerlabel: 'Employees: $value',
        theme: 'fusion',
        exportenabled: '1',
        exportfilename: 'payrollDoughnutChart1',
      },
      this.mapDoughNutChartData(this.stats, 'client', '', 'employeesAmount')
    );

    this.barChartData = new ChartData(
      {
        caption: 'AIP\'s Financial Details',
        decimals: '2',
        numberPrefix: '$',
        subcaption: '',
        xaxisname: 'Concept',
        yaxisname: 'Amount (BZD)',
        plottooltext: ' <b>$label</b> - $<b>$value</b>',
        numbersuffix: '',
        theme: 'fusion',
        exportenabled: '1',
        exportfilename: 'payrollBarChart1',
      },
      this.barDataSwitch('AIP')
    );
    this.setClientTableData('AIP');
  }
  barDataSwitch(client) {
    const data = this.barChartSwitchableData.filter((item) => item.client === client);
    return data[0].data;
  }
  mapBarChartData(data: any[]) {
    const mirrorData = JSON.parse(JSON.stringify(data));
    let mappedItems = [];
    mappedItems = mirrorData.map((item) => {
      const keyArray = {
        client: item._id.client,
        data: [],
      };
      delete item.totalRegularHours;
      delete item.totalOvertimeHours;
      delete item.totalHolidayHoursX2;
      delete item.totalHolidayHoursX1;
      delete item.totalWeeklyWages;
      delete item.employeesAmount;
      delete item.campaigns;
      delete item._id;
      Object.keys(mirrorData[0]).forEach((key, index) => {
        const result = key.replace(/([A-Z])/g, ' $1');
        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        keyArray.data.push({
          label: finalResult,
          value: Math.round(item[key] * 100) / 100,
        });
      });
      return keyArray;
    });

    return mappedItems;
  }

  setClientTableData(client) {
    const data = JSON.parse(JSON.stringify(this.stats.filter((item) => item._id.client === client)[0]));
    delete data._id;
    const mappedData = Object.keys(data).map((key, index) => {
      const result = key.replace(/([A-Z])/g, ' $1');
      const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      if (key === 'campaigns') {
        return {
          label: finalResult,
          value: data[key].length,
        };
      } else {
        const transform = this.minutesecondsPipe.transform(Math.round(data[key] * 100) / 100);
        const value =
          index === 5 || index === 7 || index === 9 || index === 11
            ? transform
            : (Math.round(data[key] * 100) / 100).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            });
        return {
          label: finalResult,
          value: value,
        };
      }
    });
    this.clientTableDataSource = new MatTableDataSource(mappedData);
  }

  calculateTotals(data: any[]) {
    const calculatedTotal = {
      campaigns: 0,
      employeesAmount: 0,
      totalPayed: 0,
      totalMonthlyWages: 0,
      totalWeeklyWages: 0,
      totalTaxes: 0,
      totalRegularHours: 0,
      totalRegularHoursPay: 0,
      totalOvertimeHours: 0,
      totalOvertimeHoursPay: 0,
      totalHolidayHoursX2: 0,
      totalHolidayHoursX2Pay: 0,
      totalHolidayHoursX1: 0,
      totalHolidayHoursX1Pay: 0,
      totalBonus: 0,
      totalOtherpay: 0,
      totalCompanyContributions: 0,
      totalEmployeeContributions: 0,
    };

    const returnedArr = Object.keys(calculatedTotal).map((key, index) => {
      const result = key.replace(/([A-Z])/g, ' $1');
      const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      if (key === 'campaigns') {
        return {
          label: finalResult,
          value: data.reduce((a, b) => {
            return {[key]: a[key].concat(b[key])};
          })[key].length,
        };
      } else {
        let value;
        const totalRegularHoursIndex = 6;
        const totalOvertimeHoursIndex = 8;
        const totalHolidayHoursX2PayIndex = 10;
        const totalHolidayHoursX1PayIndex = 12;

        if (
          index === totalRegularHoursIndex ||
          index === totalOvertimeHoursIndex ||
          index === totalHolidayHoursX2PayIndex ||
          index === totalHolidayHoursX1PayIndex
        ) {
          const calc =
            Math.round(
              data.reduce((a, b) => {
                return { [key]: a[key] + b[key] };
              })[key] * 100
            ) / 100;
          value = this.minutesecondsPipe.transform(calc);
        } else {
          value =
            Math.round(
              data.reduce((a, b) => {
                return { [key]: a[key] + b[key] };
              })[key] * 100
            ) / 100;
          value = parseInt(value, 10).toLocaleString('en-US', {
            minimumFractionDigits: 2,
          });
        }
        return {
          label: finalResult,
          value: value,
        };
      }
    });

    return returnedArr;
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
  reloadAll() {
    this.route.queryParams.subscribe((params) => {
      const { id } = params;
      this._payrollService.getPayroll(id, '', false).subscribe((result) => {
        this.stats = result.stats;
        this.payroll = result.payroll;
        this.dataSource = new MatTableDataSource(this.payroll);
        this.rows = this.dataSource.data;
        this.filterItems = ['employeeId', 'employeeName', 'client', 'campaign'];
        this.barChartSwitchableData = this.mapBarChartData(this.stats);
        this.totals = this.calculateTotals(this.stats);
        this.totalTableDataSource = new MatTableDataSource(this.totals);
        this.initializeCharts();
      });
    });
  }
  editPayrollRecord(row) {
    const dialogRef = this.matDialog.open(EditPayrollDetailComponent, {
      width: '600px',
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.reloadAll();
    });
  }
  deletePayrollRecord(row) {
    console.log(row);
  }
  finalize() {
    if (this.rows[0].isPayed) {
      const query = this.user;
      this._payrollService.updatePayroll(this.rows[0].payroll_Id, query, 'FIN').subscribe((result) => {
        this.reloadAll();
      });
    } else {
      this.failedFinalizeSwal.fire().then((e) => noop());
    }
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
