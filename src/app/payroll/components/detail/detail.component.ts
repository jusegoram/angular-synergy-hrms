import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {EditPayrollDetailComponent} from './edit-payroll-detail/edit-payroll-detail.component';
import {MatDialog} from '@angular/material/dialog';
import {PayrollService} from './../../services/payroll.service';
import {MinuteSecondsPipe} from './../../../shared/pipes/minute-seconds.pipe';
import {MatTableDataSource} from '@angular/material/table';
import {ChartData, Datum} from '../../../shared/models/ChartData';
import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {MatStepper} from '@angular/material/stepper';
import {noop} from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
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
    private matDialog: MatDialog
  ) {
    this.user = this._payrollService.getDecodedToken();
    console.log(this.user);
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

  applyFilter(filter: string) {
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
    const data = this.barChartSwitchableData.filter(
      (item) => item.client === client
    );
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
    const data = JSON.parse(
      JSON.stringify(this.stats.filter((item) => item._id.client === client)[0])
    );
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
        const transform = this.minutesecondsPipe.transform(
          Math.round(data[key] * 100) / 100
        );
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
        if (index === 6 || index === 8 || index === 10 || index === 12) {
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
      this._payrollService
        .updatePayroll(this.rows[0].payroll_Id, query, 'FIN')
        .subscribe((result) => {
          console.log(result);
          this.reloadAll();
        });
    } else {
      this.failedFinalizeSwal.fire().then((e) => noop());
    }
  }
}
