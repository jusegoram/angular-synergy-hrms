import { Injectable } from '@angular/core';
import { environment } from '@synergy/environments';
import { Client, Department, Position } from '@synergy-app/shared/models/positions-models';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { TIME_VALUES } from '@synergy/environments/enviroment.common';
import { Employee, MenuItem } from '@synergy-app/shared/models';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  api = environment.apiUrl;
  _departments: Observable<any> = null;
  _clients: Observable<any> = null;
  _shifts: Observable<any> = null;
  _employees: Observable<any> = null;
  _users: Observable<any> = null;

  constructor(protected httpClient: HttpClient) {}

  userTypes = [
    { value: 0, viewValue: 'Accounting' },
    { value: 1, viewValue: 'Management' },
    { value: 2, viewValue: 'Training' },
    { value: 3, viewValue: 'Administrator' },
    { value: 4, viewValue: 'Human Resources' },
    { value: 5, viewValue: 'Operations' },
    { value: 9999, viewValue: 'Web Administrator' },
  ];
  createDepartment(department: Department) {
    const body = JSON.stringify(department);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/admin/payroll/department', body, {
      headers: headers,
    });
  }
  getDepartment(): Observable<any> {
    if (!this._departments) {
      this._departments = this.httpClient.get<any>(this.api + '/admin/payroll/department').pipe(
        map((data) => {
          data.forEach((element) => {
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
  updateDepartment(department: Department) {
    const body = JSON.stringify(department);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', department._id);
    return this.httpClient.put(this.api + '/admin/payroll/department', body, {
      headers: headers,
      params: params,
    });
  }
  deleteDepartment(param) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('_id', param);
    return this.httpClient.delete(this.api + '/admin/payroll/department', {
      headers: headers,
      params: params,
    });
  }
  clearDepartment() {
    this._departments = null;
  }
  createPosition(position: Position, id) {
    const body = JSON.stringify(position);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', id);
    return this.httpClient.post(this.api + '/admin/payroll/position', body, {
      headers: headers,
      params: params,
    });
  }
  updatePosition(positions: Position[]) {
    const body = JSON.stringify(positions);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(this.api + '/admin/payroll/position', body, {
      headers: headers,
    });
  }
  deletePosition(param) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('_id', param);
    return this.httpClient.delete(this.api + '/admin/payroll/position', {
      headers: headers,
      params: params,
    });
  }

  getUsers(): Observable<any> {
    if (!this._users) {
      this._users = this.httpClient.get<any>(this.api + '/users').pipe(
        map((data) => {
          return data;
        }),
        publishReplay(1),
        refCount()
      );
    }
    return this._users;
  }
  editUser(param): any {
    if (param) {
      const body = JSON.stringify(param);
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.httpClient.put(this.api + '/users/' + param._id, body, {
        headers: headers,
      });
    }
    throw new Error('Failed to get the model...');
  }
  deleteUser(param: any): any {
    return this.httpClient.delete(this.api + '/users/' + param);
  }
  clearUsers() {
    this._users = null;
  }
  // getting and setting clients and campaigns
  getClient(): Observable<any> {
    if (!this._clients) {
      this._clients = this.httpClient.get<any>(this.api + '/admin/employee/client').pipe(
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
    return this.httpClient.post(this.api + '/admin/employee/client', body, {
      headers: headers,
      params: params,
    });
  }
  updateClient(client: Client) {
    const body = JSON.stringify(client);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', client._id);
    return this.httpClient.put(this.api + '/admin/employee/client', body, {
      headers: headers,
      params: params,
    });
  }

  getShift(): Observable<any> {
    if (!this._shifts) {
      this._shifts = this.httpClient.get<any>(this.api + '/admin/employee/shift').pipe(
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
  saveShift(shift: any) {
    const body = JSON.stringify(shift);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/admin/employee/shift', body, {
      headers: headers,
    });
  }
  editShift(shift: any, id) {
    const body = JSON.stringify(shift);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', id);
    return this.httpClient.put(this.api + '/admin/employee/shift', body, {
      headers: headers,
      params: params,
    });
  }
  deleteShift(shift): any {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('_id', shift._id);
    return this.httpClient.delete(this.api + '/admin/employee/shift', {
      headers: headers,
      params: params,
    });
  }
  clearShift() {
    this._shifts = null;
  }

  getEmployees() {
    if (!this._employees) {
      this._employees = this.httpClient.get<any>(this.api + '/admin/employee/employee').pipe(
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
    return this.httpClient.put(this.api + '/admin/employee/update', body, {
      headers: headers,
      params: params,
    });
  }
  deleteEmployee(employee: Employee) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('_id', employee._id).set('employeeId', employee.employeeId + '');
    return this.httpClient.delete(this.api + '/admin/employee/delete', {
      headers: headers,
      params: params,
    });
  }

  minutesToTime(shift): object[] {
    const fixedShift = [];
    for (const day of shift) {
      if (day.endTime !== null && day.startTime !== null) {
        const storedEnd = parseInt(day.endTime, 10);
        const storedStart = parseInt(day.startTime, 10);

        const hoursEnd = Math.floor(storedEnd / TIME_VALUES.MINUTES_PER_HOUR);
        const minutesEnd = storedEnd - hoursEnd * TIME_VALUES.SECONDS_PER_HOUR;

        const hoursStart = Math.floor(storedStart / TIME_VALUES.MINUTES_PER_HOUR);
        const minutesStart = storedStart - hoursStart * TIME_VALUES.SECONDS_PER_HOUR;
        let minutesEndStr = '';
        if (minutesEnd < 10) {
          minutesEndStr = '0' + minutesEnd;
        } else {
          minutesEndStr = minutesEnd + '';
        }
        let minutesStartStr = '';
        if (minutesStart < 10) {
          minutesStartStr = '0' + minutesStart;
        } else {
          minutesStartStr = minutesStart + '';
        }
        day.endTime = hoursEnd + ':' + minutesEndStr;
        day.startTime = hoursStart + ':' + minutesStartStr;
      }
      fixedShift.push(day);
    }
    return fixedShift;
  }
  TimeToMinutes(shift) {}

  getAllMenus() {
    return this.httpClient.get<Array<MenuItem>>(this.api + '/admin/menu');
  }
  getLogs(query) {
    const { _id, page, limit } = query;
    const params = new HttpParams().set('page', page).set('limit', limit);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(`${this.api}/logs/${_id}`, {
      headers: headers,
      params: params,
    });
  }

  getUploads(query) {
    const { _id, page, limit } = query;
    const params = new HttpParams().set('page', page).set('limit', limit);
    const body = JSON.stringify(query);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(`${this.api}/uploads/${_id}`, {
      headers: headers,
      params: params,
    });
  }

  getHolidays(query) {
    const { pageNumber, size } = query;
    const params = new HttpParams().set('page', pageNumber).set('limit', size);
    const _id = 'q';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(`${this.api}/admin/payroll/holidays/${_id}`, {
      headers: headers,
      params: params,
    });
  }
  updateHolidays() {}
  setHolidays() {}
  deleteHolidays() {}
  getSoSec(query) {
    const { pageNumber, size } = query;
    const params = new HttpParams().set('page', pageNumber).set('limit', size);
    const _id = 'q';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(`${this.api}/admin/payroll/socialsecurity/${_id}`, { headers: headers, params: params });
  }
  updateSoSec() {}
  setSoSec() {}
  deleteSoSec() {}
  getIncomeTax(query) {
    const { pageNumber, size } = query;
    const params = new HttpParams().set('page', pageNumber).set('limit', size);
    const _id = 'q';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(`${this.api}/admin/payroll/incomeTax/${_id}`, {
      headers: headers,
      params: params,
    });
  }
  updateIncomeTax() {}
  setIncomeTax() {}
  deleteIncomeTax() {}
}
