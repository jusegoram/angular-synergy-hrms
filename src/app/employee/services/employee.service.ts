import { IEmployee } from '../Employee';
import { EmployeePosition, EmployeePersonal, EmployeeCompany, EmployeePayroll } from './models/employee-models';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseType, ResponseContentType } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { Client, Department } from '../../admin/employee/models/positions-models';
import { PositionComponent } from '../detail/position/position.component';
@Injectable()
export class EmployeeService {
    employees: IEmployee[];
    constructor(private http: Http) { }
    siteURI = environment.siteUri;
    departments: Department[] = null;
    clients: Client[] = null;
    currentPosition: EmployeePosition = null;
    getAvatar(param: string): Observable<Response> {
        const obj = { id: param };
        const body = JSON.stringify(obj);
        const params = '?id=' + param;
        return this.http.get(this.siteURI + '/employee/avatar' + params, { responseType: ResponseContentType.Blob });
    }
    
    getEmployees() {
        return this.http.get(this.siteURI + '/employee/populateTable')
            .map(
                (response: Response) => {
                    const employees = response.json().obj;
                    const transformedEmployees: IEmployee[] = [];
                    for (const employee of employees) {
                        transformedEmployees.push(new IEmployee(
                            employee._id,
                            employee.employeeId,
                            employee.firstName,
                            employee.lastName,
                            employee.socialSecurity,
                            employee.status,
                            employee.idasnum,
                            employee.gender,
                            employee.middleName
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
        return this.http.get(this.siteURI + '/employee/main' + params)
            .map(
                (response: Response) => {
                    const employee = response.json().obj;
                    let transformedEmployee: IEmployee;
                    transformedEmployee = new IEmployee(
                        employee._id,
                        employee.employeeId,
                        employee.firstName,
                        employee.lastName,
                        employee.socialSecurity,
                        employee.status,
                        employee.idasnum,
                        employee.gender,
                        employee.middleName
                    );
                    return transformedEmployee;
                })
            .catch((err: Response) => Observable.throw(err));
    }
    updateEmployee(employee: IEmployee) {
        const body = JSON.stringify(employee);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.put(this.siteURI + '/employee/main?id=' + employee.id, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
// get, update, and save Company details
    getCompany(param: string) {
        const obj = { employeeId: param };
        const body = JSON.stringify(obj);
        const params = '?employeeId=' + param;
        return this.http.get(this.siteURI + '/employee/company' + params)
            .map(
                (response: Response) => {
                    const employeeCompanys = response.json().obj;
                    const transformedEmployeeCompany: EmployeeCompany[] = [];
                    for (const employeeCompany of employeeCompanys) {
                        transformedEmployeeCompany.push(new EmployeeCompany(
                            employeeCompany._id,
                            employeeCompany.employeeId,
                            employeeCompany.employee,
                            employeeCompany.client,
                            employeeCompany.campaign,
                            employeeCompany.supervisor,
                            employeeCompany.trainer,
                            employeeCompany.trainingGroupRef,
                            employeeCompany.trainingGroupNum,
                            employeeCompany.hireDate,
                            employeeCompany.terminationDate,
                            employeeCompany.reapplicant,
                            employeeCompany.reapplicantTimes
                        ));
                    }
                    return transformedEmployeeCompany;
                })
            .catch((err: Response) => Observable.throw(err));
    }
    updateCompany(company: EmployeeCompany) {
        const body = JSON.stringify(company);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.put(this.siteURI + '/employee/company?id=' + company.id, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    saveCompany(company: EmployeeCompany) {
        const body = JSON.stringify(company);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(this.siteURI + '/employee/company?id=' + company.id, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    // get, update, and save Position information
    getPositions(param: string) {
        const obj = { employeeId: param };
        const body = JSON.stringify(obj);
        const params = '?employeeId=' + param;
        return this.http.get(this.siteURI + '/employee/position' + params)
            .map(
                (response: Response) => {
                    const employeePositions = response.json().obj;
                    const transformedEmployeePosition: EmployeePosition[] = [];
                    for (const employeePosition of employeePositions) {
                        transformedEmployeePosition.push(new EmployeePosition(
                            employeePosition._id,
                            employeePosition.employeeId,
                            employeePosition.employee,
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
    updatePosition(position: EmployeePosition) {
        const body = JSON.stringify(position);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.put(this.siteURI + '/employee/position?id=' + position.id, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    savePosition(position: EmployeePosition) {
        const body = JSON.stringify(position);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(this.siteURI + '/employee/position?id=' + position.id, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
// get, update, save Personal information
    getPersonal(param: string) {
        const obj = { employeeId: param };
        const body = JSON.stringify(obj);
        const params = '?employeeId=' + param;
        return this.http.get(this.siteURI + '/employee/personal' + params)
            .map(
                (response: Response) => {
                    const employeePersonals = response.json().obj;
                    const transformedEmployeePersonal: EmployeePersonal[] = [];
                    for (const employeePersonal of employeePersonals) {
                        transformedEmployeePersonal.push(new EmployeePersonal(
                            employeePersonal._id,
                            employeePersonal.employeeId,
                            employeePersonal.employee,
                            employeePersonal.maritalStatus,
                            employeePersonal.address,
                            employeePersonal.town,
                            employeePersonal.district,
                            employeePersonal.addressDate,
                            employeePersonal.celNumber,
                            employeePersonal.telNumber,
                            employeePersonal.birthDate,
                            employeePersonal.birthPlaceDis,
                            employeePersonal.birthPlaceTow,
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
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.put(this.siteURI + '/employee/personal?id=' + personal.id, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    savePersonal(personal: EmployeePersonal) {
        const body = JSON.stringify(personal);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(this.siteURI + '/employee/personal?id=' + personal.id, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getPayroll(param: string) {
        const obj = { employeeId: param };
        const body = JSON.stringify(obj);
        const params = '?employeeId=' + param;
        return this.http.get(this.siteURI + '/employee/payroll' + params)
            .map(
                (response: Response) => {
                    const employeePayrolls = response.json().obj;
                    const transformedEmployeePayroll: EmployeePayroll[] = [];
                    for (const employeePayroll of employeePayrolls) {
                        transformedEmployeePayroll.push(new EmployeePayroll(
                            employeePayroll._id,
                            employeePayroll.employeeId,
                            employeePayroll.employee,
                            employeePayroll.TIN,
                            employeePayroll.positionid,
                            employeePayroll.payrollType,
                            employeePayroll.bankName,
                            employeePayroll.bankAccount,
                            employeePayroll.billable
                        ));
                    }
                    return transformedEmployeePayroll;
                })
            .catch((err: Response) => Observable.throw(err));
    }

    updatePayroll(payroll: EmployeePayroll) {
        const body = JSON.stringify(payroll);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.put(this.siteURI + '/employee/payroll?id=' + payroll.id, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    savePayroll(payroll: EmployeePayroll) {
        const body = JSON.stringify(payroll);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(this.siteURI + '/employee/payroll?id=' + payroll.id, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getClient(){
        return this.http.get(this.siteURI + '/admEmp/client')
                .map((response: Response) =>{
                    const clients = response.json().obj;
                    const transformedClients: Client[] = [];
                    for(const client of clients) {
                        transformedClients.push(new Client(
                            "saved",
                            client._id,
                            client.name,
                            client.campaigns
                        ));
                    }
                    this.clients = transformedClients;
                    return transformedClients;
                })
                .catch((err: Response) => Observable.throw(err));
    }

    getDepartment(){
        return this.http.get(this.siteURI + '/payroll/department')
                .map((response: Response) =>{
                    const departments = response.json().obj;
                    let transformedDepartments: Department[] = [];
                    for(const department of departments) {
                        transformedDepartments.push(new Department(
                            "saved",
                            department._id,
                            department.name,
                            department.positions
                        ));
                    }
                    this.departments = transformedDepartments;
                    return transformedDepartments;
                })
                .catch((err: Response) => Observable.throw(err));
    }

    getCurrentPosition(employeeId: string){
        return this.http.get(this.siteURI+ '/employee/latestPosition?id=' + employeeId)
        .map((response: Response)=>{
            const position = response.json().obj[0];
            let transformedPosition: EmployeePosition;

            transformedPosition = new EmployeePosition(
                position._id,
                position.employeeId,
                position.employee,
                position.positionid,
                position.position,
                position.startDate,
                position.endDate
            )
            this.currentPosition = transformedPosition;
            return transformedPosition;
          })
        .catch((err: Response)=> Observable.throw(err));
    }

}

