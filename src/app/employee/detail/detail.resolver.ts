import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../shared/models/employee/employee';

@Injectable()
export class DetailResolver implements Resolve<Employee> {
  constructor(private employeeService: EmployeeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee> {
    return this.employeeService.getEmployee(route.queryParams.id);
  }
}
