import {
  Employee, EmployeeCompany, EmployeePayroll,
  EmployeePersonal, EmployeePosition, EmployeeFamily,
  EmployeeComment,
  EmployeeAttrition} from '../Employee';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { publishReplay, refCount, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

export class Store {
  constructor(public id: string, public obs: Observable<any>) {
  }
  getObservable(): Observable<any> {
    return this.obs;
  }
}

@Injectable()
export class EmployeeService {
  siteURI = environment.siteUri;
  _clients: Observable<any> = null;
  _shift: Observable<any> = null;
  clients: any;
  store: Store[];
  _avatar: Observable<Blob> = null;
  _departments: Observable<any> = null;
  _employees: Observable<Array<Employee>> = null;
  _detail: Observable<Employee> = null;
  public status = [
    { value: 'active', viewValue: 'Active' },
    { value: 'resignation', viewValue: 'Resignation' },
    { value: 'dissmisal', viewValue: 'Dissmisal' },
    { value: 'termination', viewValue: 'Termination' },
    { value: 'on-hold', viewValue: 'On-Hold' },
    { value: 'transfer', viewValue: 'Transfer' },
    { value: 'undefined', viewValue: 'Undefined' },
 //   { value: 'trainee', viewValue: 'Trainee' }
  ];
  public reaptimes = [
    {value: 0, viewValue: '0'},
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
    {value: 4, viewValue: '4'},
    {value: 5, viewValue: '5'},
    {value: 6, viewValue: '6'},
    {value: 7, viewValue: '7'},
    {value: 8, viewValue: '8'},
    {value: 9, viewValue: '9'},
    {value: 10, viewValue: '10'}];
  public genders = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' }];

  constructor(protected httpClient: HttpClient) {
    this.store = [];
  }

  getReport(query: any): Observable<any> {
    const body = query;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/report', body, { headers: headers }).pipe(
      map((data: any) => {
      data.forEach(element => {
        delete element.__v;
          if (element.employee !== null) {
        const employee = element.employee;
        delete element.employee;
        element._id = employee._id;
        element.firstName = employee.firstName;
        element.middleName = employee.middleName;
        element.lastName = employee.lastName;
        element.gender = employee.gender;
        element.socialSecurity = employee.socialSecurity;
        element.status = employee.status;
        element.position = employee.position[employee.position.length - 1];
        element.shift = employee.shift[employee.shift.length - 1];
        element.personal = employee.personal;
        element.education = employee.education;
        element.comments = employee.comments;
        element.family = employee.family;
        element.payroll = employee.payroll;
        }else {
        delete element.employee;
        }
      });
      return  data;
      })
    );
  }

  /**
   *
   *
   * @returns {Observable<any>}
   * @memberof EmployeeService
   */

  getClient(): Observable<any> {
    if (!this._clients) {
      this._clients = this.httpClient.get<any>('/api/v1/admin/employee/client').pipe(
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
  getDepartment(): Observable<any> {
    if (!this._departments) {
      this._departments = this.httpClient.get<any>('/api/v1/admin/payroll/department').pipe(
        publishReplay(1),
        refCount()
      );
    }
    return this._departments;
  }
  getShift(): Observable<any> {
    if (!this._shift) {
      this._shift = this.httpClient.get<any>('/api/v1/admin/employee/shift').pipe(
        publishReplay(1),
        refCount()
      );
    }
    return this._shift;
  }
  /**
   *
   *
   * @returns {Observable<Array<Employee>>}
   * @memberof EmployeeService
   */
  getEmployees(): Observable<Array<Employee>> {
    if (!this._employees) {
      this._employees = this.httpClient.get<Array<Employee>>('/api/v1/employee/populateTable').pipe(
        publishReplay(1),
        refCount()
      );
    }
    return this._employees;
  }
  /**
   *
   *
   * @param {string} param
   * @returns {Observable<Employee>}
   * @memberof EmployeeService
   */
  findEmployeeById(param: string): Observable<Employee> {
    const params = new HttpParams().set('id', param);
    return this._detail = this.httpClient.get<Employee>('/api/v1/employee/main', { params: params });
  }

  cachedAvatar(param: string): Observable<any> {
    const i = this.store.findIndex((res) => res.id === param);
    if (i >= 0) {
      return this.store[i].getObservable();
    } else {
      const newAvatar = new Store(param, this.getAvatar(param));
      this.store.push(newAvatar);
      return newAvatar.getObservable();
    }
  }
  getAvatar(param: string): Observable<any> {
    const params = new HttpParams().set('id', param);
    return this.httpClient.get('/api/v1/employee/avatar', { params: params, responseType: 'blob' }).pipe(
      publishReplay(1),
      refCount(),
    );
  }
  getPositions(param: string): Observable<Array<EmployeePosition>> {
    const params = new HttpParams().set('id', param);
    return this.httpClient.get<Array<EmployeePosition>>('/api/v1/employee/position', { params: params });
  }
  getPersonal(param: string): Observable<EmployeePersonal> {
    const params = new HttpParams().set('id', param);
    return this.httpClient.get<EmployeePersonal>('/api/v1/employee/personal', { params: params });
  }
  getPayroll(param: string): Observable<EmployeePayroll> {
    const params = new HttpParams().set('id', param);
    return this.httpClient.get<EmployeePayroll>('/api/v1/employee/payroll', { params: params });
  }
  getfamily(param: string): Observable<Array<EmployeeFamily>> {
    const params = new HttpParams().set('id', param);
    return this.httpClient.get<Array<EmployeeFamily>>('/api/v1/employee/family', { params: params });
  }
  getComment(param: string): Observable<Array<EmployeeComment>> {
    const params = new HttpParams().set('id', param);
    return this.httpClient.get<Array<EmployeeComment>>('/api/v1/employee/comment', { params: params });
  }
  /**
   *
   *
   * @param {Employee} employee
   * @returns
   * @memberof EmployeeService
   */
  updateEmployee(employee: Employee) {
    const body = JSON.stringify(employee);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', employee._id);
    return this.httpClient.put('/api/v1/employee/main', body, { headers: headers, params: params });
  }
  updateCompany(company: EmployeeCompany) {
    const body = JSON.stringify(company);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', company._id);
    return this.httpClient.put('/api/v1/employee/company', body, { headers: headers, params: params });
  }
  updatePosition(position: any) {
    const body = JSON.stringify(position);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', position._id);

    return this.httpClient.put('/api/v1/employee/position', body, { headers: headers, params: params });
  }
  updatePersonal(personal: EmployeePersonal) {
    const body = JSON.stringify(personal);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', personal._id);

    return this.httpClient.put('/api/v1/employee/personal', body, { headers: headers, params: params });
  }
  updatePayroll(payroll: EmployeePayroll) {
    const body = JSON.stringify(payroll);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', payroll._id);

    return this.httpClient.put('/api/v1/employee/payroll', body, { headers: headers, params: params });
  }
  updateFamily(family: EmployeeFamily) {
    const body = JSON.stringify(family);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', family._id);

    return this.httpClient.put('/api/v1/employee/family', body, { headers: headers, params: params });
  }
  updateComment(comment: EmployeeComment) {
    const body = JSON.stringify(comment);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', comment._id);

    return this.httpClient.put('/api/v1/employee/payroll', body, { headers: headers, params: params });
  }
  /**
   *
   *
   * @param {Employee} employee
   * @returns
   * @memberof EmployeeService
   */
  saveEmployee(employee: Employee) {
    const body = JSON.stringify(employee);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/new', body, { headers: headers });
  }
  saveCompany(company: EmployeeCompany) {
    const body = JSON.stringify(company);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/company', body, { headers: headers });
  }
  savePosition(position: EmployeePosition) {
    const body = JSON.stringify(position);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/position', body, { headers: headers });
  }
  savePersonal(personal: EmployeePersonal) {
    const body = JSON.stringify(personal);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/personal', body, { headers: headers });
  }
  savePayroll(payroll: EmployeePayroll) {
    const body = JSON.stringify(payroll);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/payroll', body, { headers: headers });
  }
  saveFamily(family: EmployeeFamily) {
    const body = JSON.stringify(family);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/family', body, { headers: headers });
  }
  saveComment(comment: EmployeeComment) {
    const body = JSON.stringify(comment);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/comment', body, { headers: headers });
  }
  saveAttrition(com: EmployeeAttrition) {
    const body = JSON.stringify(com);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/attrition', body, { headers: headers });
  }
  saveShift(employeeShift: any) {
    const body = JSON.stringify(employeeShift);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/shift', body, { headers: headers });
  }
  /**
   *
   *
   * @memberof EmployeeService
   */
  clearEmployees() {
    this._employees = null;
  }
  clearClients() {
    this._clients = null;
  }
  clearDepartments() {
    this._departments = null;
  }
  clearAvatar(param: string) {
    const i = this.store.findIndex((res) => res.id === param);
    this.store.splice(i, 1);
  }
  clearShift() {
    this._shift = null;
  }
}

