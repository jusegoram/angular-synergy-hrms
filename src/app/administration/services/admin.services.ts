import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseType, ResponseContentType } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Department, Position, Client, Campaign } from '../employee/models/positions-models';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { publishReplay, refCount, map} from 'rxjs/operators';

@Injectable()
export class AdminService {
    constructor(private http: Http, protected httpClient: HttpClient) { }
    siteURI = environment.siteUri;
    _departments: Observable<any> = null;
    _clients: Observable<any> = null;
    _shifts: Observable<any> = null;
    _employees: Observable<any> = null;
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
          data.state = 'saved';
          return data;
        }),
        publishReplay(1),
        refCount()
      );
    }
    return this._shifts;
  }

  saveShift(shift: any) {
    const body = JSON.stringify(shift);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/admin/employee/shift', body, { headers: headers});
  }

  updateShift(shift: any) {
    const body = JSON.stringify(shift);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', shift._id);
    return this.httpClient.put('/api/v1/admin/employee/shift', body, { headers: headers, params: params });
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
}
