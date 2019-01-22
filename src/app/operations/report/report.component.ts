import { Component, OnInit, ViewChild } from '@angular/core';
import { OperationsService } from '../operations.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { EmployeeHours } from '../../employee/Employee';
import { FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';

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
  displayedColumns = ['employeeID', 'dialerID', 'hours', 'tosHours', 'timeIn', 'date'];
  dateFrom = new FormControl();
  dateTo = new FormControl();

  constructor(private _opsService: OperationsService) { }
  ngOnInit() {
    this.populateTable();
  }

  populateTable() {
    this._opsService.getHours()
      .subscribe(res => {
        res.map((item) => {
          item.date = new Date(item.date);
        });
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
    if (this.dateFrom.value === null) {
      this.dataSource.data = this.dataSource.data
      .filter((item) => item.date <= this.dateTo.value);
    }else if (this.dateTo.value === null) {
      this.dataSource.data = this.dataSource.data
      .filter((item) => item.date >= this.dateFrom.value);
    }else {
      this.dataSource.data = this.dataSource.data
      .filter((item) => item.date >= this.dateFrom.value && item.date <= this.dateTo.value);
    }
  }
  reload() {
    this.dateFrom.reset();
    this.dateTo.reset();
    this.dataSource.data = this.hours;
  }
  export() {
    const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, main, 'hours-info');
    XLSX.writeFile(wb, 'export-hours.xlsx');
  }
}
