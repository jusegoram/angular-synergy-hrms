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
  dataSource: any;
  displayedColumns = ['selected', 'employeeID', 'name', 'position', 'status', 'details'];
  constructor(private employeeService: EmployeeService) {
  }
  ngAfterViewInit() {
    this.populateTable();
  }
  populateTable() {
    this.employeeService.getEmployees().subscribe(
      (employees: IEmployee[]) => {
        this.employees = employees;
        this.dataSource = new MatTableDataSource(employees);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
    }
      ngOnInit() {
        this.populateTable();
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
