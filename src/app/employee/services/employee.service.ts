import { IEmployee } from '../Employee';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EmployeeService {
    employees: IEmployee[];
    constructor(private http: Http) {}

    getEmployees() {
    return this.http.get('https://blink-test.herokuapp.com/employee/getall' )
       .map(
           (response: Response) => {
            const employees = response.json().obj;
           const transformedEmployees: IEmployee[] = [];
            for (const employee of employees){
                transformedEmployees.push( new IEmployee(
                    employee._id,
                    employee.employeeId,
                    employee.firstName,
                    employee.middleName,
                    employee.lastName,
                    employee.birthDate,
                    employee.socialSecurity,
                    employee.client,
                    employee.campaign,
                    employee.status,
                    employee.hireDate,
                ));
            }
            this.employees = transformedEmployees;
            return transformedEmployees;
           })
           .catch((err: Response) => Observable.throw(err));
    }

    getDetails(param: string) {
        const obj = { id: param };
        const body = JSON.stringify(obj);
        const params = '?id=' + param;
        return this.http.get('https://blink-test.herokuapp.com/employee/getDetail' + params)
            .map(
           (response: Response) => {
            const employee = response.json().obj;
           let transformedEmployee: IEmployee;
            transformedEmployee = new IEmployee(
                employee._id,
                employee.employeeId,
                employee.firstName,
                employee.middleName,
                employee.lastName,
                employee.birthDate,
                employee.socialSecurity,
                employee.client,
                employee.campaign,
                employee.status,
                employee.hireDate,
                );
            return transformedEmployee;
           })
           .catch((err: Response) => Observable.throw(err));
    }
    save(employee: IEmployee) {
        const body = JSON.stringify(employee);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://blink-test.herokuapp.com/user/signin', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}

