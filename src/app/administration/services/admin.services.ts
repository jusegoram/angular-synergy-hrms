import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseType, ResponseContentType } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Department, Position, Client, Campaign } from '../employee/models/positions-models';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { publishReplay, refCount, map} from 'rxjs/operators';
import { Employee } from '../../employee/Employee';

@Injectable()
export class AdminService {


    constructor(private http: Http, protected httpClient: HttpClient) { }
    siteURI = environment.siteUri;
    _departments: Observable<any> = null;
    _clients: Observable<any> = null;
    _shifts: Observable<any> = null;
    _employees: Observable<any> = null;
    _users: Observable<any> = null;
  getDepartment(): Observable<any> {
    if (!this._departments) {
      this._departments = this.httpClient.get<any>('/api/v1/admin/payroll/department').pipe(
        map((data) => {
          data.forEach(element => {
             element.state = 'saved';
          });
         // console.log(data);
         return data;
        }),
        publishReplay(1),
        refCount()
      );
    }
    return this._departments;
  }
  getUsers(): Observable<any> {
    if (!this._users) {
      this._users = this.httpClient.get<any>('/api/v1/allUsers').pipe(
        map((data) => {
          return data;
        }),
        publishReplay(1),
        refCount()
      );
    }
    return this._users;
  }
  saveDepartment(department: Department) {
    const body = JSON.stringify(department);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/admin/payroll/department', body, { headers: headers});
  }

  savePosition(department: Department) {
    const body = JSON.stringify(department);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/admin/payroll/position', body, { headers: headers});
  }
  updateDepartment(department: Department) {
    const body = JSON.stringify(department);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', department._id);
    return this.httpClient.put('/api/v1/admin/payroll/department', body, { headers: headers, params: params });
  }

  // getting and setting clients and campaigns
  getClient(): Observable<any> {
    if (!this._clients) {
      this._clients = this.httpClient.get<any>('/api/v1/admin/employee/client').pipe(
        map((data) => {
          data.state = 'saved';
          return data;
        }),
        publishReplay(1),
        refCount()
      );
    }
    return this._clients;
  }

  saveClient(client: Client) {
    const body = JSON.stringify(client);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('token', localStorage.getItem('token'));
    return this.httpClient.post('/api/v1/admin/employee/client', body, { headers: headers, params: params });
  }

  updateClient(client: Client) {
    const body = JSON.stringify(client);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', client._id);
    return this.httpClient.put('/api/v1/admin/employee/client', body, { headers: headers, params: params });
  }

  getShift(): Observable<any> {
    if (!this._shifts) {
      this._shifts = this.httpClient.get<any>('/api/v1/admin/employee/shift').pipe(
        map((data) => {
            data.map((element) => {
              element.shift = this.minutesToTime(element.shift);
            });
          return data;
        }),
        publishReplay(1),
        refCount()
      );
    }
    return this._shifts;
  }
  clearShift() {
    this._shifts = null;
  }
  saveShift(shift: any) {
    const body = JSON.stringify(shift);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/admin/employee/shift', body, { headers: headers});
  }

  editShift(shift: any, id) {
    const body = JSON.stringify(shift);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', id);
    return this.httpClient.put('/api/v1/admin/employee/shift', body, { headers: headers, params: params });
  }
  deleteShift(shift): any {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams()
    .set('_id', shift._id);
    return this.httpClient.delete('/api/v1/admin/employee/shift', { headers: headers, params: params });
  }
  getEmployees() {
    if (!this._employees) {
      this._employees = this.httpClient.get<any>('/api/v1/admin/employee/employee').pipe(
        map((data) => {
          return data;
        }),
        publishReplay(1),
        refCount()
      );
    }
    return this._employees;
  }
  refreshEmployees() {
    this._employees = null;
  }
  updateEmployee(employee: Employee) {
    const body = JSON.stringify(employee);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('_id', employee._id);
    return this.httpClient.put('/api/v1/admin/employee/update', body, { headers: headers, params: params });
  }
  deleteEmployee(employee: Employee) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams()
    .set('_id', employee._id)
    .set('employeeId', employee.employeeId + '');
    return this.httpClient.delete('/api/v1/admin/employee/delete', { headers: headers, params: params });
  }

  deleteUser(param: any): any {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams()
    .set('_id', param);
    return this.httpClient.delete('/api/v1/user', { headers: headers, params: params });
  }

  minutesToTime(shift): object[] {
    const fixedShift = [];
    for (const day of shift) {
      if (day.endTime !== null && day.startTime !== null) {
        const storedEnd = parseInt(day.endTime, 10);
        const storedStart = parseInt(day.startTime, 10);

        const hoursEnd = Math.floor(storedEnd / 60);
        const minutesEnd = storedEnd - (hoursEnd * 60);

        const hoursStart = Math.floor(storedStart / 60);
        const minutesStart = storedStart - (hoursStart * 60);
        let minutesEndStr = '';
        if (minutesEnd < 10) {
          minutesEndStr = '0' + minutesEnd;
        }else {
          minutesEndStr = minutesEnd + '';
        }
        let minutesStartStr = '';
        if (minutesStart < 10) {
          minutesStartStr = '0' + minutesStart;
        }else {
          minutesStartStr = minutesStart + '';
        }
        day.endTime = hoursEnd + ':' + minutesEndStr;
        day.startTime = hoursStart + ':' + minutesStartStr;
      }
      fixedShift.push(day);
    }
    return fixedShift;
  }
  TimeToMinutes(shift) {
  }

  clearUsers() {
    this._users = null;
  }
}
