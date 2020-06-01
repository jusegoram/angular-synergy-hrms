import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-non-finalized-payrolls-table',
  templateUrl: './non-finalized-payrolls-table.component.html',
  styleUrls: ['./non-finalized-payrolls-table.component.scss'],
})
export class NonFinalizedPayrollsTableComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() set nonFinalizedPayrolls(value) {
    if (value) {
      this.populateTable(value);
    }
  }
  @Output() onPaySelectedPayrollsBtnClicked = new EventEmitter<any>();
  dataSource: any;
  checkedRows: any;
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
    'details',
  ];

  constructor() {}

  ngOnInit(): void {}

  populateTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.checkedRows = new SelectionModel(true, []);
  }
}
