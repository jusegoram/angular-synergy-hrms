import { Employee } from '../Employee';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { EmployeeService } from '../services/employee.service';
import {SessionService} from '../../session/services/session.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component ({
    templateUrl: 'manage.component.html',
    styleUrls: ['manage.component.scss']
})
export class ManageComponent implements OnInit,  AfterViewInit {
  //FIXME: sort not working ( search for new sort implementation material.angular.io/components/sort/overview)
  @ViewChild(MatSort) _sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  employees: Employee [];
  selectedEmployees: string[] = [];
  // dataSource = any;
  dataSource = null;
  auth: any;
  pag: any;
  pagSize: any;
  displayedColumns = ['employeeID', 'name', 'position', 'status', 'details'];
  constructor(
    private employeeService: EmployeeService,
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute) {
  }
  ngAfterViewInit() {
    this.employeeService.getClient().subscribe((result: any) => { });
    this.employeeService.getDepartment().subscribe((result: any) => { });

  }

  populateTable() {
    this.employeeService.getEmployees()
      .subscribe(res => {
        this.employees = res;
        this.dataSource = new MatTableDataSource(this.employees);
          this.dataSource.paginator = this.paginator;
        },
      error => console.log(error), () => {
        console.log('all done');
        this.dataSource.sort = this._sort;
      });
  }

      ngOnInit() {
        this.populateTable();
        this.getAuth();
        this.route.queryParams.subscribe(params => {
          this.pag = params['page'];
          this.pagSize = params['size'];
          this.setPage(this.pag, this.pagSize);
      });
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
      setPage(i, size) {
          let pag = parseInt(i, 10);
          let pagSize = parseInt(size, 10);
          pag = pag ? pag : 0;
          pagSize = pagSize ? pagSize : 10;

          this.paginator._changePageSize(pagSize);
          this.paginator._pageIndex = pag + 1;
          this.paginator.previousPage();
      }
      onPageChange(event) {
        const page = event.pageIndex;
        const size = event.pageSize;
        window.history.pushState({}, '', `/employee/manage?page=${page}&size=${size}`);
      }
}
