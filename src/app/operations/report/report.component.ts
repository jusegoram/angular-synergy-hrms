import { Component, OnInit, ViewChild } from '@angular/core';
import { OperationsService } from '../operations.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { EmployeeHours } from '../../employee/Employee';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @ViewChild(MatSort) _sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = null;
  auth: any;
  hours: EmployeeHours[];
  displayedColumns = ['employeeID', 'dialerID', 'hours', 'tosHours', 'timeIn'];
  constructor(private _opsService: OperationsService) { }
  ngOnInit() {
    this.populateTable();
  }

  populateTable() {
    this._opsService.getHours()
      .subscribe(res => {
        this.hours = res;
        this.dataSource = new MatTableDataSource(this.hours);
          this.dataSource.paginator = this.paginator;
        },
      error => console.log(error), () => {
        console.log('all done');
        this.dataSource.sort = this._sort;
      });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  dateFilter(event) {
    console.log(event);
  }
  reload() {
  }
}
