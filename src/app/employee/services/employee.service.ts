import {Employee, EmployeeCompany, EmployeePayroll, EmployeePersonal, EmployeePosition} from '../Employee';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { publishReplay, refCount, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';


@Injectable()
export class EmployeeService {
  siteURI = environment.siteUri;
  _clients: Observable<any> = null;
  clients: any;
  _departments: Observable<any> = null;
  _employees: Observable<Array<Employee>> = null;
  _detail: Observable<Employee> = null;
    constructor( protected httpClient: HttpClient) { }
  //
  //
  // Get Client options and Departments options.
  getClient(): Observable<any> {
    if ( !this._clients) {
     this._clients = this.httpClient.get<any>(this.siteURI + '/admEmp/client').pipe(
       map((data) => {
         this.clients = data;
         return data;
       }),
       publishReplay(1),
       refCount()
     );
    }
    return this._clients;
  }
  getDepartment(): Observable <any> {
    if ( !this._departments) {
       this._departments = this.httpClient.get<any>(this.siteURI + '/payroll/department').pipe(
         publishReplay(1),
         refCount()
       );
    }
    return this._departments;
  }
 //
 //
 // Get Table data
  getEmployees(): Observable<Array<Employee>> {
    if (!this._employees) {
      this._employees = this.httpClient.get<Array<Employee>>(this.siteURI + '/employee/populateTable').pipe(
        publishReplay(1),
        refCount()
      );
    }
    return this._employees;
  }
  //
  //
  // Get all employee data
  findEmployeeById(param: string): Observable<Employee> {
      const params = new HttpParams().set( 'id' , param );
     return this._detail = this.httpClient.get<Employee>(this.siteURI + '/employee/main', { params: params } );
  }
  getAvatar(param: string): Observable<any> {
    const params = new HttpParams().set( 'id' , param );
    return this.httpClient.get(this.siteURI + '/employee/avatar', { params: params, responseType: 'blob' });
  }
  getPositions(param: string): Observable<Array<EmployeePosition>> {
    const params = new HttpParams().set( 'id' , param );
    return this.httpClient.get<Array<EmployeePosition>>(this.siteURI + '/employee/position', { params: params } );
  }
  getPersonal(param: string): Observable<EmployeePersonal> {
    const params = new HttpParams().set( 'id' , param );
    return this.httpClient.get<EmployeePersonal>(this.siteURI + '/employee/personal', { params: params });
  }
  getPayroll(param: string): Observable<EmployeePayroll> {
    const params = new HttpParams().set( 'id' , param );
    return this.httpClient.get<EmployeePayroll>(this.siteURI + '/employee/payroll', { params: params });
  }
  //
  //
  // Update Employee information.
  updateEmployee( employee: Employee ) {
    const body = JSON.stringify(employee);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams().set( 'id' , employee._id );
    return this.httpClient.put(this.siteURI + '/employee/main', body, { headers: headers, params: params });
  }
  updateCompany(company: EmployeeCompany) {
    const body = JSON.stringify(company);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams().set( 'id' , company._id );
    return this.httpClient.put(this.siteURI + '/employee/company', body, { headers: headers, params: params });
  }
  updatePosition(position: EmployeePosition) {
    const body = JSON.stringify(position);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams().set( 'id' , position._id );

    return this.httpClient.put(this.siteURI + '/employee/position', body, { headers: headers, params: params });
  }
  updatePersonal(personal: EmployeePersonal) {
    const body = JSON.stringify(personal);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams().set( 'id' , personal._id );

    return this.httpClient.put(this.siteURI + '/employee/personal', body, { headers: headers, params: params });
  }
  updatePayroll(payroll: EmployeePayroll) {
    const body = JSON.stringify(payroll);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams().set( 'id' , payroll._id );

    return this.httpClient.put(this.siteURI + '/employee/payroll' , body, { headers: headers, params: params });
  }
  //
  //
  // Save Employee Information.
  saveEmployee(employee: Employee ) {
      const body = JSON.stringify(employee);
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.siteURI + '/employee/new' , body, {headers: headers});
  }
  saveCompany(company: EmployeeCompany) {
    const body = JSON.stringify(company);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.siteURI + '/employee/company', body, {headers: headers});
  }
  savePosition(position: EmployeePosition) {
    const body = JSON.stringify(position);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.siteURI + '/employee/position', body, { headers: headers });
  }
  savePersonal(personal: EmployeePersonal) {
    const body = JSON.stringify(personal);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.siteURI + '/employee/personal', body, { headers: headers });
  }
  savePayroll(payroll: EmployeePayroll) {
    const body = JSON.stringify(payroll);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.siteURI + '/employee/payroll', body, {headers: headers});
  }
  //
  //
  // Clear Observables
    clearEmployees() {
      this._employees = null;
    }
    clearClients() {
      this._clients = null;
    }
    clearDepartments() {
      this._departments = null;
    }
}

