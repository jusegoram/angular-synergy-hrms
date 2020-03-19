import { MinuteSecondsPipe } from './../../../../shared/pipes/minute-seconds.pipe';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { PayrollService } from '../../../services/payroll.service';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-payed-payrolls',
  templateUrl: './payed-payrolls.component.html',
  styleUrls: ['./payed-payrolls.component.scss']
})
export class PayedPayrollsComponent implements OnInit {
  @Input() type;
  wb: XLSX.WorkBook;
  // checkedRows: any;
  // dataSource: any;
  // displayedColumns = [
  //   'selected',
  //   'payRun',
  //   'fromDate',
  //   'toDate',
  //   'employeesAmount',
  //   'totalPayed',
  //   'totalCompanyContributions',
  //   'totalEmployeeContributions',
  //   'totalTaxes'];
  rows = new Array();
  columns = [];
  selected = new Array();
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  statsRows = new Array();
  statsColumns = [
    { name: 'CONCEPT', prop: 'concept' },
    { name: 'AMOUNT', prop: 'amount'}
  ];
  constructor(
    private currency: CurrencyPipe,
    private _datePipe: DatePipe,
    private _payrollService: PayrollService,
    private _minuteSeconds: MinuteSecondsPipe,
    private snackBar: MatSnackBar
  ) {
    this.columns = [
      { name: 'PAY RUN DATE', prop: 'paymentDate', pipe: this.datePipe() },
      { name: 'FROM DATE', prop: 'fromDate', pipe: this.datePipe() },
      { name: 'TO DATE', prop: 'toDate', pipe: this.datePipe() },
      { name: 'EMPLOYEES', prop: 'employeesAmount' },
      {
        name: 'TOTAL NET',
        prop: 'totalPayed.$numberDecimal',
        pipe: this.currency
      },
      {
        name: 'RCC SOCIAL CON.',
        prop: 'totalCompanyContributions.$numberDecimal',
        pipe: this.currency
      },
      {
        name: 'TOTAL TAXES',
        prop: 'totalTaxes.$numberDecimal',
        pipe: this.currency
      },
      { name: 'EXPORT' }
    ];
  }

  ngOnInit() {
    this.wb = XLSX.utils.book_new();
    this._payrollService.getPayroll('', '', '', true).subscribe(result => {
      this.rows = result;
      for (let i = 0; i < 10; i++) {
        this.rows = [...this.rows, ...result];
      }
    });
  }

  datePipe(){
    return {transform: (value) => this._datePipe.transform(value, 'MM/dd/yyyy')}
}
  populateTable(data) {
    // this.dataSource = new MatTableDataSource(data)
    // this.checkedRows = new SelectionModel(true, []);
  }
  sendPayslips(payId) {
    this._payrollService.sendPayslipts(payId).subscribe(res => {});
  }

  export() {
    // if(this.checkedRows.selected.length === 1) {
    //   const {payrolls, payedDate, fromDate, toDate} = this.checkedRows.selected[0];
    //   this._payrollService.getPayroll(payrolls, '', true).subscribe(result =>{
    //     const data = result.map(i => {
    //       delete i._id;
    //       delete i.payrolls;
    //       return Object.assign({
    //         'payRun': moment(payedDate).format('MM/DD/YYYY').toString(),
    //         'from': moment(fromDate).format('MM/DD/YYYY').toString(),
    //         'to': moment(toDate).format('MM/DD/YYYY').toString(),
    //       }, i)
    //     });
    //     const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    //   XLSX.utils.book_append_sheet(this.wb, main, 'sheet 1');
    //   const date = moment().format('MM-DD-YYYY HH:mm:ss').toString();
    //   XLSX.writeFile(this.wb, `payroll-${date}.xlsx`);
    //   })
    // }else this.snackBar.open('Please export one Pay run at a time', 'I will, Thanks.', {duration: 5000})
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    if(selected.length === 1) {
      this.loadStats(selected[0]);
    }
  }
  loadStats(row) {
    this.statsRows = this.mapTotalStats(row);
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
      }else {
        return {
          concept: finalName,
          amount: stats[key]
        };
      }
    });

    return returnedArr.sort((a,b) => a.concept.localeCompare(b.concept) );
  }
}
