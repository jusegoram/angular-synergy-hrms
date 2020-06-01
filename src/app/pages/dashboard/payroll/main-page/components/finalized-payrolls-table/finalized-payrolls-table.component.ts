import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-finalized-payrolls-table',
  templateUrl: './finalized-payrolls-table.component.html',
  styleUrls: ['./finalized-payrolls-table.component.scss'],
})
export class FinalizedPayrollsTableComponent implements OnInit {
  @Input() set finalizedPayrolls(value) {
    if (value) {
      this.populateTable(value);
    }
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns = [
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

  ngOnInit() {}

  populateTable = (data) => {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }
}
