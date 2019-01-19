import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeHours } from '../employee/Employee';
import { publishReplay, refCount } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OperationsService {
_employeeHours: Observable<Array<EmployeeHours>>;
  constructor(private httpClient: HttpClient) {
    this._employeeHours = null;
   }

  getHours(): Observable<Array<EmployeeHours>> {
    if (!this._employeeHours) {
      this._employeeHours = this.httpClient.get<Array<EmployeeHours>>('/api/v1/employee/allHours').pipe(
        publishReplay(1),
        refCount()
      );
    }
    return this._employeeHours;
  }

  saveHours(hours: EmployeeHours[]) {
    const body = JSON.stringify(hours);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/upload/hours', body, { headers: headers });
  }
  deleteHours() {

  }
}
