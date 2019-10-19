import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
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
  checkedRows: any;
  dataSource: any;
  displayedColumns = [
    'selected',
    'payRun',
    'fromDate',
    'toDate',
    'employeesAmount',
    'totalPayed',
    'totalCompanyContributions',
    'totalEmployeeContributions',
    'totalTaxes'];
  constructor( private _payrollService: PayrollService, public dialogRef: MatDialogRef<PayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.wb = XLSX.utils.book_new();
    this._payrollService.getPayedPayrolls().subscribe(result => {
        this.populateTable(result);
    });
  }
  populateTable(data){
    this.dataSource = new MatTableDataSource(data)
    this.checkedRows = new SelectionModel(true, []);
  }
  sendPayslips(payId){
    this._payrollService.sendPayslipts(payId).subscribe(res => {

    })
  }

  export(payrolls){
    this._payrollService.getPayroll(payrolls, '').subscribe(result =>{
      const data = result.map(i => i);
      const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(this.wb, main, 'sheet 1');
    const date = moment().format('MM-DD-YYYY HH:mm:ss').toString();
    XLSX.writeFile(this.wb, `payroll-${date}.xlsx`);
    })

  }

}
