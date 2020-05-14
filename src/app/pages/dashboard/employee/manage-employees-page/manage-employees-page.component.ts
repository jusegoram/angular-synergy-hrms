import { Employee } from '@synergy-app/shared/models';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '@synergy-app/core/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'manage-employees-page.component.html',
  styleUrls: ['manage-employees-page.component.scss'],
})
export class ManageEmployeesComponent implements OnInit, AfterViewInit {
  // FIXME: sort not working ( search for new sort implementation material.angular.io/components/sort/overview)
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  employees: Employee[];
  dataSource = null;
  auth: any;
  filterValue;
  displayedColumns = [
    'employeeId',
    'name',
    'status',
    'company.client',
    'company.campaign',
    'company.shiftManager',
    'company.supervisor',
  ];
  constructor(private employeeService: EmployeeService, private route: ActivatedRoute) {}
  ngAfterViewInit() {
    this.employeeService.getClient().subscribe((result: any) => {});
    this.employeeService.getDepartment().subscribe((result: any) => {});
  }

  async populateTable() {
    try {
      this.employees = await this.employeeService.getEmployees().toPromise();
      this.dataSource = new MatTableDataSource(this.employees);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'name':
            return [item.firstName, item.middleName, item.lastName].join(' ');
          case 'company.client':
            return (item.company && item.company.client) || 'z';
          case 'company.campaign':
            return (item.company && item.company.campaign) || 'z';
          case 'company.shiftManager':
            return (
              (item.company && item.company.campaign && item.company.shiftManager && item.company.shiftManager.name) || 'z'
            );
          case 'company.supervisor':
            return (
              (item.company && item.company.campaign && item.company.supervisor && item.company.supervisor.name) || 'z'
            );

          default:
            return item[property];
        }
      };
    } catch (e) {
      console.log(e);
    }
  }

  async ngOnInit() {
    await this.populateTable();
    this.auth = this.employeeService.getAuth();
  }
  applyFilter(filter: string) {
    if (filter) {
      filter = filter.trim(); // Remove whitespace
      filter = filter.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource.filter = filter;
    }
  }
  async reload() {
    this.employeeService.clearEmployees();
    await this.populateTable();
  }
}
