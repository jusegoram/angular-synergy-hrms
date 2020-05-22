import { interval, Observable } from 'rxjs';
import { map, publishReplay, refCount, share } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SessionService } from '@synergy-app/core/services/session.service';
import { environment } from '@synergy/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OperationsService {
  api = environment.apiUrl;
  _employeeHours: Observable<Array<any>>;
  _clients: Observable<any>;
  _departments: Observable<any>;
  public clients: any;
  private clock: Observable<Date>;

  constructor(private httpClient: HttpClient, private sessionService: SessionService) {
    this.clock = interval(1000).pipe(
      map((tick) => new Date()),
      share()
    );
    this._employeeHours = null;
  }

  getClock(): Observable<Date> {
    return this.clock;
  }

  getDepartment(): Observable<any> {
    if (!this._departments) {
      this._departments = this.httpClient
        .get<any>(this.api + '/admin/payroll/department')
        .pipe(publishReplay(1), refCount());
    }
    return this._departments;
  }
  getHours(query): Observable<any> {
    const body = query;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.api + '/operations/hour', body, {
      headers: headers,
    });
  }

  deleteHours(query): Observable<any> {
    const params = new HttpParams().set('ids', JSON.stringify(query));
    return this.httpClient.delete(this.api + '/operations/hour', {params: params});
  }

  getKpis(query): Observable<any> {
    const body = query;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.api + '/operations/kpi', body, {
      headers: headers,
    });
  }

  getAttendance(query) {
    const params = new HttpParams()
      .set('date', query.date)
      .set('startTime', query.startTime)
      .set('endTime', query.endTime)
      .set('client', query.client)
      .set('campaign', query.campaign);
    return this.httpClient.get(this.api + '/operations/attendance', {
      params: params,
    });
  }

  getAttendanceHistory(employeeId, fromDate, toDate) {
    const params = new HttpParams().set('employeeId', employeeId).set('fromDate', fromDate).set('toDate', toDate);
    return this.httpClient.get(this.api + '/employee/shift', {
      params: params,
    });
  }
  getMatrix(client, campaign, from, to, positions) {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('client', client)
      .set('campaign', campaign)
      .set('positions', JSON.stringify(positions));
    return this.httpClient.get(this.api + '/operations/matrix', {
      params: params,
    });
  }
  getClient(): Observable<any> {
    const contextFilter = this.getDecodedToken().clients;
    let params;
    if (contextFilter && contextFilter.length > 0) {
      params = new HttpParams().set('clients', JSON.stringify(contextFilter));
    }
    if (!this._clients) {
      this._clients = this.httpClient
        .get<any>(this.api + '/admin/employee/client', {params: params})
        .pipe(
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

  saveHours(hours: any[]) {
    const body = JSON.stringify(hours);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.api + '/operations/hours', body, {
      headers: headers,
    });
  }

  clearHours() {
    this._employeeHours = null;
  }
  getTemplate(templateUrl) {
    return this.httpClient.get(this.api + templateUrl, {
      responseType: 'blob',
    });
  }
  tokenGetter() {
    return 'JWT ' + localStorage.getItem('id_token');
  }
  getDecodedToken() {
    return this.sessionService.decodeToken();
  }
}
