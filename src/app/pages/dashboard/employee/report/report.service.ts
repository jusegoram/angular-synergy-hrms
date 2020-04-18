import { Injectable } from '@angular/core';
import { PROJECTIONS } from '@synergy-app/shared/models/reports.constants';
import { noop, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@synergy/environments/environment';
import { SessionService } from '@synergy-app/shared/services/session.service';

@Injectable()
export class ReportService {
  api = environment.apiUrl;
  projections = PROJECTIONS;
  auth: any;
  constructor(private _session: SessionService, protected httpClient: HttpClient) {
    this.auth = this._session.decodeToken();
  }

  toQuery(form: Object): any {
    const toArray = (param) => (param instanceof Array ? {$in: param}  : {$in: [param]});
    const assertEmpty = (param) => {
      if ([null, '', {}, []].includes(param)) {
        return true;
      }
      return param instanceof Array && param.length === 0;
    };
    try {
      const keys = Object.keys(form);
      const query = {};
      keys.forEach((key) => {
        switch (true) {
          case ['manager', 'shiftManager', 'supervisor', 'trainer'].includes(key):
            !assertEmpty(form[key])
              ? query['company.' + key + '.manager_id'] = form[key].manager_id
              : noop();
            break;
          case ['hireDate', 'terminationDate'].includes(key):
            !assertEmpty(form[key])
              ? (query['company.' + key] = { $gte: form[key].begin, $lte: form[key].end })
              : noop();
            break;
          case key === 'client':
            if (assertEmpty(form[key])) {
              this.auth.clients.length > 0 ? query['company.' + key] = toArray(this.auth.clients) : noop();
            } else {
              query['company.' + key] = toArray(form[key].map(i => i.name));
            }
            break;
          case key === 'trainingGroupRef':
            !assertEmpty(form['trainingGroupNum'])
              ? (query['company.' + key ] =  toArray(form[key]))
              : noop();
            break;
          case key === 'status':
            !assertEmpty(form[key])
              ? (query[key] = toArray(form[key]))
              : noop();
            break;
          default:
            !assertEmpty(form[key])
              ? (query['company.' + key] = toArray(form[key]))
              : noop();
        }
      });
      return query;
    } catch (e) {
      console.log(e);
      return {};
    }
  }
  getReport(type: string, query: any, options?): Observable<any> {
    const body = {
      filter: this.toQuery(query),
      projection: this.projections[type],
      options: options,
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/employee/report/' + type, body, {
      headers: headers,
    });
  }
}
