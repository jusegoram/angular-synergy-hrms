import { Employee } from '../Employee';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { EmployeeService } from '../services/employee.service';
import {SessionService} from '../../session/services/session.service';

@Component ({
    templateUrl: 'manage.component.html',
    styleUrls: ['manage.component.scss']
})
export class ManageComponent implements OnInit,  AfterViewInit {
  //FIXME: sort not working ( search for new sort implementation material.angular.io/components/sort/overview)
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  employees: Employee [];
  selectedEmployees: string[] = [];
  // dataSource = any;
  dataSource = null;
  auth: any;
  displayedColumns = ['employeeID', 'name', 'position', 'status', 'details'];
  constructor(private employeeService: EmployeeService, private sessionService: SessionService) {
  }
  ngAfterViewInit() {
    this.populateTable();
    this.employeeService.getClient().subscribe((result: any) => { });
    this.employeeService.getDepartment().subscribe((result: any) => { });

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
        this.getAuth();
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
      getAuth() {
        this.auth = this.sessionService.permission();
      }
      reload() {
        this.employeeService.clearEmployees();
        this.employeeService.getEmployees()
      .subscribe(res => {
          this.dataSource.data = res;
        },
      error => console.log(error));
      }
}
