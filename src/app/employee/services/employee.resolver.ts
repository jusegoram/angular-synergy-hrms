
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {EmployeeService} from './employee.service';
import {Employee} from '../Employee';

@Injectable()
export class EmployeeResolver implements Resolve<Employee> {

  constructor(private employeeService: EmployeeService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee> {
    return this.employeeService.findEmployeeById(route.queryParams.id)
      .pipe( map ((employee) =>  {
        employee = employee[0];
        return employee;
      })
    );
  }

}
