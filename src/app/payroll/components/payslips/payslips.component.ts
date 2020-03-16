import { MinuteSecondsPipe } from './../../../shared/pipes/minute-seconds.pipe';
import { PayrollService } from './../../services/payroll.service';
import { Component, OnInit } from '@angular/core';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-payslips',
  templateUrl: './payslips.component.html',
  styleUrls: ['./payslips.component.scss']
})
export class PayslipsComponent implements OnInit {
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
    selectedValue: any;
    records: any[] = [];
    employeePayslip: any;
  constructor(
    private _exportasService: ExportAsService,
    private _payrollService: PayrollService,
    private minutesSecondsPipe: MinuteSecondsPipe,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    this._payrollService.getPayroll('', '', '' , true).subscribe(result => {
      this.populateTable(result);
  });
  }
  populateTable(data){
    this.dataSource = new MatTableDataSource(data)
    this.checkedRows = new SelectionModel(true, []);
  }
  transform(hrs){
    const result = this.minutesSecondsPipe.transform(hrs);
    return result;
  }
  getRecords(){
  //  FIXME: update acording to new spec
    // if(this.checkedRows.selected.length === 1) {
    //   const {payrolls} = this.checkedRows.selected[0];
    //   this._payrollService.getPayroll(payrolls, '', true).subscribe(result => {
    //       this.records = result.sort((a, b) => { return a.firstName.localeCompare(b.firstName)});
    //   })
   // }

  }
  getPayslip(){
    const {employee} = this.selectedValue._id;
    const {payId} = this.checkedRows.selected[0]._id;
    this._payrollService.getPayslip(employee, payId).subscribe( result => {
      this.snackBar.open('Your download will start in less than 3 Seconds', 'Ok', {duration: 500});
      this.employeePayslip = result
      setTimeout(() => {
        this.saveToPdf();
      }, 500);
      });


  }
  saveToPdf(){
    const config: ExportAsConfig = {
      type: 'pdf',
      elementId: 'payslip',
      options: {
         format: 'letter', orientation: 'portrait'
      }
    }
    this._exportasService.save(config, `${this.selectedValue.employeeId} - payslip`).subscribe(() => {
      this.snackBar.open('Download Started', 'Great!, thanks.', {duration: 500});
  })
  }
}