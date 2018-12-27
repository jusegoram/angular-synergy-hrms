import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.services';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Employee } from '../../employee/Employee';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employeeCtrl= new FormControl();
  employees: Employee[];
  selectedEmployee: Employee;
  filteredEmployees: Observable<Employee[]>;

  constructor(private adminService: AdminService) {
    this.adminService.refreshEmployees();
    this.selectedEmployee = new Employee('', null, '', '', '', '', '', '');
   }

  ngOnInit() {
    this.adminService.getEmployees().subscribe((data) => {
      this.employees = data;
    });
    this.filteredEmployees = this.employeeCtrl.valueChanges
    .pipe(
      startWith(''),
      map(value => {
        return this.employees ? this._filterEmployees(value) : this.employees;
       })
    );
  }
  _filterEmployees(value: string): Employee[] {
    const filterValue = value.toString().toLowerCase();
    return this.employees.filter(employee => employee['firstName'].toLowerCase().includes(filterValue));
  }
  setEmployee(employee: Employee) {
    this.selectedEmployee = employee;
  }
  getEmployee(): object {
    console.log(this.selectedEmployee);
    return this.selectedEmployee;
  }
  onUpdateEmployee() {
    this.adminService
    .updateEmployee(this.selectedEmployee)
    .subscribe((response) => {
    });
  }
  onDeleteEmployee() {
    this.adminService
    .deleteEmployee(this.selectedEmployee)
    .subscribe((response) => {
    });
  }
}
