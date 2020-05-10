import { Component, OnInit } from '@angular/core';
import { AdminService } from '@synergy-app/core/services';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Employee } from '@synergy-app/shared/models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-employee',
  templateUrl: './employee-page.component.html',
  styleUrls: ['./employee-page.component.scss'],
})
export class EmployeePageComponent implements OnInit {
  employeeCtrl = new FormControl();
  employees: any[];
  selectedEmployee: Employee;
  filteredEmployees: Observable<Employee[]>;

  constructor(private adminService: AdminService) {
    this.adminService.refreshEmployees();
  }

  ngOnInit() {
    this.adminService.getEmployees().subscribe((data) => {
      data.map((item) => {
        item.fullSearchName =
          '(' + item.employeeId + ') ' + item.firstName + ' ' + item.middleName + ' ' + item.lastName;
      });
      this.employees = data;
    });
    this.filteredEmployees = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this.employees ? this._filterEmployees(value) : this.employees;
      })
    );
  }
  _filterEmployees(value: string): Employee[] {
    const filterValue = value.toString().toLowerCase();
    return this.employees.filter((employee) => employee['fullSearchName'].toLowerCase().includes(filterValue));
  }
  setEmployee(employee: Employee) {
    this.selectedEmployee = employee;
  }
  getEmployee(): object {
    return this.selectedEmployee;
  }
  onUpdateEmployee() {
    this.adminService.updateEmployee(this.selectedEmployee).subscribe((response) => {});
  }
  onDeleteEmployee() {
    this.adminService.deleteEmployee(this.selectedEmployee).subscribe((response) => {});
  }
}
