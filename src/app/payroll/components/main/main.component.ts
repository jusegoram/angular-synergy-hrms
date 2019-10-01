import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { PayrollService } from './../../services/payroll.service';
import { Component, OnInit, ViewChild } from '@angular/core';

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
  selectedType = {type: '', view: 'All'};
  auth: any;

  constructor(private _payrollService: PayrollService) {
  }

  ngOnInit() {
    this.auth = this._payrollService.getAuth();
    this.getData('');
  }

  onSelected(e){

  }
  populateTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filter: string) {
    if(filter){
      filter = filter.trim(); // Remove whitespace
      filter = filter.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource.filter = filter;
    }
  }

  getData(id) {
    this._payrollService
    .getPayroll(id, this.selectedType.type)
    .subscribe(result => {
      this.populateTable(result);
    }, error => {
      console.log(error);
    });
  }
  reloadData() {
    this.dataSource = null;
    this.populateTable(this.getData(''));
  }
}
