import { PayDialogComponent } from './pay/pay.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PayrollService } from './../../services/payroll.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { ExportBottomSheetComponent } from '../manage/export-bottom-sheet/export-bottom-sheet.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource: any;
  displayedColumns = [
    'selected',
    'isPayed',
    'fromDate',
    'toDate',
    'employeesAmount',
    'totalPayed',
    'totalCompanyContributions',
    'totalEmployeeContributions',
    'totalTaxes',
    'details'];
  filterValue = '';
  type = [
    {type: '', view: 'All'},
    {type: 'BI-WEEKLY', view: 'Bi-Weekly Payroll'},
    {type: 'SEMIMONTHLY', view: 'Semi-Monthly Payroll'}
  ];
  refreshEvent: any;
  selectedType = '';
  auth: any;
  checkedRows: any;
  user;
  constructor(
    private _payrollService: PayrollService,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _bottomSheet: MatBottomSheet

    ) {
      this.user = this._payrollService.getDecodedToken();
  }

  ngOnInit() {
    this.auth = this._payrollService.getAuth();
    this.getData('all');
  }


  onPaySelectedPayrolls(){
    if (this.checkedRows.selected.length === 2) {
      const item = this.checkedRows.selected;
      const ids = [
        item[0]._id,
        item[1]._id
      ];
      const query = this.user;
      this._payrollService.updatePayroll(JSON.stringify(ids), query, 'PAY').subscribe(result => {
        this.getData('all');
      });
    } else {
      this.openSnackBar(`It's only allowed to pay 2 Payrolls at a time`, 'Got it, Thanks!')
    }
  }

  onPayHistory() {
    const dialogRef = this.dialog.open(PayDialogComponent, {
      height: '100%',
      width: '80%',
      data: {}
    });
    const instance = dialogRef.componentInstance;
    instance.type =  'PAY';
    dialogRef.afterClosed().subscribe(result => {
      // do something
      });
    // this._payrollService.getPayedHistory().subscribe(result => {

    // })
  }
  populateTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.checkedRows = new SelectionModel(true, []);
  }

  applyFilter(filter: string) {
    if (filter){
      filter = filter.trim(); // Remove whitespace
      filter = filter.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource.filter = filter;
    }
  }

  getData(id) {
    this._payrollService
    .getPayroll(id, this.selectedType, false)
    .subscribe((result: any[]) => {
      this.populateTable(result);
    }, error => {
      console.log(error);
    });
  }
  reloadData(e) {
    this.refreshEvent = e;
    this.getData('all');
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }
}
