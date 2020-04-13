import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PayrollService } from './../../../services/payroll.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-finalized-payrolls',
  templateUrl: './finalized-payrolls.component.html',
  styleUrls: ['./finalized-payrolls.component.scss'],
})
export class FinalizedPayrollsComponent implements OnInit, OnChanges {
  @Input() type: string;
  @Input() refresh: any;
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
  constructor(private _payrollService: PayrollService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.refresh) {
      this.getData('all');
    }
  }
  ngOnInit() {
    this._payrollService.getPayroll('all', this.type, true);
  }

  getData = (param) => {
    this._payrollService.getPayroll('all', this.type, true).subscribe((res) => {
      this.populateTable(res);
    });
  }

  populateTable = (data) => {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }
}
