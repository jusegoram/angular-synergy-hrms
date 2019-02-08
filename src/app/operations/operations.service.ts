import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeHours } from '../employee/Employee';
import { publishReplay, refCount, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OperationsService {

_employeeHours: Observable<Array<EmployeeHours>>;
_clients: Observable<any>;
public clients: any;
  constructor(private httpClient: HttpClient) {
    this._employeeHours = null;
   }

  getHours(): Observable<Array<EmployeeHours>> {
    if (!this._employeeHours) {
      this._employeeHours = this.httpClient.get<Array<EmployeeHours>>('/api/v1/operations/allHours').pipe(
        publishReplay(1),
        refCount()
      );
    }
    return this._employeeHours;
  }
  getKpis(query): Observable<any> {
    const body = query;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/operations/kpi', body, { headers: headers });
  }

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

  saveHours(hours: EmployeeHours[]) {
    const body = JSON.stringify(hours);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/operations/hours', body, { headers: headers });
  }
  clearHours() {
    this._employeeHours = null;
  }
}
