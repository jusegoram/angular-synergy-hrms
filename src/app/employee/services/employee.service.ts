import { IEmployee } from '../Employee';
import { EmployeePosition, EmployeePersonal } from './models/employee-models';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
@Injectable()
export class EmployeeService {
    employees: IEmployee[];
    constructor(private http: Http) {}
    siteURI = environment.siteUri;
getEmployees() {
return this.http.get(this.siteURI + '/employee/getall' )
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
    return this.http.get(this.siteURI + '/employee/getDetail' + params)
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

getPositions(param: string) {
const obj = { employeeId: param };
const body = JSON.stringify(obj);
const params = '?employeeId=' + param;
return this.http.get(this.siteURI + '/employee/getDetail/position' + params)
.map(
    (response: Response) => {
        const employeePositions = response.json().obj;
    const transformedEmployeePosition: EmployeePosition[] = [];
        for (const employeePosition of employeePositions){
            transformedEmployeePosition.push( new EmployeePosition (
            employeePosition._id,
            employeePosition.employeeId,
            employeePosition.positionid,
            employeePosition.position,
            employeePosition.startDate,
            employeePosition.endDate
            ));
        }
        return transformedEmployeePosition;
    })
    .catch((err: Response) => Observable.throw(err));
    }

getPersonal(param: string) {
const obj = { employeeId: param };
const body = JSON.stringify(obj);
const params = '?employeeId=' + param;
return this.http.get(this.siteURI + '/employee/getDetail/personal' + params)
.map(
    (response: Response) => {
    const employeePersonals = response.json().obj;
    const transformedEmployeePersonal: EmployeePersonal[] = [];
    for (const employeePersonal of employeePersonals){
        transformedEmployeePersonal.push( new EmployeePersonal (
            employeePersonal._id,
            employeePersonal.employeeId,
            employeePersonal.address,
            employeePersonal.addressDate,
            employeePersonal.celNumber,
            employeePersonal.telNumber,
            employeePersonal.emailAddress,
            employeePersonal.emailDate,
        ));
    }
    return transformedEmployeePersonal;
    })
    .catch((err: Response) => Observable.throw(err));
    }
updatePersonal(personal: EmployeePersonal) {
    const body = JSON.stringify(personal);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.put( this.siteURI  + '/employee/update/personal?id=' + personal.id, body, {headers: headers})
        .map((response: Response) => response.json())
        .catch((error: Response) => Observable.throw(error.json()));
    }

updateEmployee(employee: IEmployee) {
        const body = JSON.stringify(employee);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.put( this.siteURI  + '/employee/update?id=' + employee.id, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}

