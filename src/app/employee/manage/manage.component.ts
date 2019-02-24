import { Employee } from '../Employee';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator, SortDirection} from '@angular/material';
import { EmployeeService } from '../employee.service';
import {SessionService} from '../../session/session.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  pag: any;
  pagSize: any;
  filterValue;
  currentSortOrder;
  displayedColumns = ['employeeId', 'firstName', 'socialSecurity','company.client', 'company.campaign', 'status', 'details'];
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
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch(property) {
              case 'company.client': return item.company.client;
              case 'company.campaign': return item.company.campaign;
              default: return item[property];
            }
          };
          this.dataSource.sort = this.sort;
      },
      null,
      () => {
        this.route.queryParams.subscribe(params => {
          this.pag = params['page'];
          this.pagSize = params['size'];
          this.filterValue = params['filter']
         this.applyFilter(params['filter']);
          this.setSort(params['srtAct'], params['srtDir']);
          this.setPage(this.pag, this.pagSize);
        });
      });
  }

      ngOnInit() {
        this.populateTable();
        this.getAuth();
      }
      applyFilter(filter: string) {
        if(filter){
          filter = filter.trim(); // Remove whitespace
          filter = filter.toLowerCase(); // MatTableDataSource defaults to lowercase matches
          this.dataSource.filter = filter;
          this.sortData();
        }
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

      setSort(active, dir){
        if(active !== '' && active !== 'undefined' && dir !== '' && dir !== 'undefined' ){
          this.dataSource.sort.active = active; this.dataSource.sort.direction = dir as SortDirection;
          this.dataSource.sort.sortChange.emit();
        }
      }

      sortData(){
        this.paginator.nextPage();
        this.paginator.previousPage();
      }
      onPageChange(event) {
        const page = event.pageIndex;
        const size = event.pageSize;
        const flt = this.filterValue? this.filterValue: '';
        const srtAct = this.dataSource.sort.active?  this.dataSource.sort.active: 'employeeId';
        const srtDir = this.dataSource.sort.direction? this.dataSource.sort.direction: '';
        window.history.pushState({}, '', `/employee/manage?page=${page}&size=${size}&filter=${flt}&srtAct=${srtAct}&srtDir=${srtDir}`);
      }

      nextPage(){
        this.paginator.nextPage();
      }

      previousPage(){
        this.paginator.previousPage();
      }
}
