import { IEmployee } from '../Employee';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { EmployeeService } from '../services/employee.service';

@Component ({
    templateUrl: 'manage.component.html',
    styleUrls: ['manage.component.scss']
})
export class ManageComponent implements OnInit,  AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  employees: IEmployee [];
  selectedEmployees: string[] = [];
  // dataSource = any;
  dataSource = null;
  displayedColumns = ['employeeID', 'name', 'position', 'status', 'details'];
  constructor(private employeeService: EmployeeService) {
  }
  ngAfterViewInit() {
    this.populateTable();
  }

  populateTable() {
    this.employeeService.getEmployees()
      .subscribe(res => {
        this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
      error => console.log(error));
  }

      ngOnInit() {
        this.populateTable();
        if(this.employeeService.clients === null){
          this.employeeService.getClient().subscribe((result: any) => { });
        }
        if(this.employeeService.departments === null){
          this.employeeService.getDepartment().subscribe((result: any) => { });
        }
      }
      applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
      }
      onSelected(event: string) {
        const eventid: string = event;
        if (!this.selectedEmployees.includes(eventid)) {
        this.selectedEmployees.push(eventid);
        }else {
          const index = this.selectedEmployees.indexOf(eventid);
          this.selectedEmployees.splice(index, 1);
        }
        console.log(this.selectedEmployees);
      }
}
