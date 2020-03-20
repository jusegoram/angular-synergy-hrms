import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { PayrollService } from '../../../services/payroll.service';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayDialogComponent implements OnInit {
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

  constructor(
    private currency: CurrencyPipe,
    private _datePipe: DatePipe,
    private _payrollService: PayrollService,
    public dialogRef: MatDialogRef<PayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
      // console.log(result);
      // this.populateTable(result);
    });
  }

  datePipe() {
    return {transform: (value) => this._datePipe.transform(value, 'MM/dd/yyyy')};
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
    if (selected.length === 1) {
      this.loadStats(selected[0]);
    }
  }
  loadStats(row) {
    console.log(row);
  }
}
