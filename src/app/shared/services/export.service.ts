import { Injectable } from '@angular/core';
import { noop, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionService } from '@synergy-app/core/services/session.service';
import moment from 'moment';
import { TIME_VALUES, PROJECTIONS, environment } from '@synergy/environments';

@Injectable()
export class ExportService {
  api = environment.apiUrl;
  projections = PROJECTIONS;
  auth: any;
  constructor(private _session: SessionService, protected httpClient: HttpClient) {
    this.auth = this._session.decodeToken();
  }

  toQuery(form: Object): any {
    const toArray = (param) => (param instanceof Array ? { $in: param } : { $in: [param] });
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
            !assertEmpty(form[key]) ? (query['company.' + key + '.manager_id'] = form[key].manager_id) : noop();
            break;
          case ['hireDate', 'terminationDate'].includes(key):
            !assertEmpty(form[key])
              ? (query['company.' + key] = { $gte: form[key].begin, $lte: form[key].end })
              : noop();
            break;
          case key === 'client':
            if (assertEmpty(form[key])) {
              this.auth.clients.length > 0 ? (query['company.' + key] = toArray(this.auth.clients)) : noop();
            } else {
              query['company.' + key] = toArray(form[key].map((i) => i.name));
            }
            break;
          case key === 'trainingGroupRef':
            !assertEmpty(form['trainingGroupNum']) ? (query['company.' + key] = toArray(form[key])) : noop();
            break;
          case key === 'status':
            !assertEmpty(form[key]) ? (query[key] = toArray(form[key])) : noop();
            break;
          default:
            !assertEmpty(form[key]) ? (query['company.' + key] = toArray(form[key])) : noop();
        }
      });
      return query;
    } catch (e) {
      console.log(e);
      return {};
    }
  }
  getReport(type: string, query: any, options?, extras?): Observable<any> {
    const body = {
      filter: this.toQuery(query),
      projection: this.projections[type],
      options: options,
      extras: extras,
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(`${this.api}/reports/employee/${type}`, body, {
      headers: headers,
    });
  }
  mapShift(report: any[]): any[] {
    return report.map((element) => {
      const { shift } = element;
      const mappedShift: any = {};
      if (shift) {
        const length = shift.length;
        for (let i = 0; i < length; i++) {
          const day = shift[i];
          mappedShift[this.dateToString(day.date)] = `${this.transformTime(day.shiftStartTime)} - ${this.transformTime(
            day.shiftEndTime
          )}`;
          if (mappedShift[this.dateToString(day.date)] === '00:00 - 00:00') {
            mappedShift[this.dateToString(day.date)] = 'DAY OFF';
          }
        }
      }
      return Object.assign(element, mappedShift);
    });
  }
  mapHours(report: any[]): any[] {
    return report.map((row) => {
      const { hours } = row;
      const mappedHours: any = {};
      if (hours) {
        const length = hours.length;
        for (let i = 0; i < length; i++) {
          const hour = hours[i];
          mappedHours[this.dateToString(hour.date)] = hour.hasHours
            ? true
            : hour.onShift
            ? false
            : 'DAY OFF';
        }
      }
      return Object.assign(row, mappedHours);
    });
  }
  transformTime(param: any): string {
    let result = '00:00';
    if (param !== null) {
      if (param.toString().includes(':')) {
        return param;
      }
      const stored = parseInt(param, 10);
      const hours = Math.floor(stored / TIME_VALUES.SECONDS_PER_MINUTE);
      const minutes = stored - hours * TIME_VALUES.SECONDS_PER_MINUTE;
      let fixedMin = minutes === 0 ? '00' : minutes;
      minutes > 0 && minutes < 10 ? (fixedMin = '0' + minutes) : noop();
      result = hours + ':' + fixedMin;
      return result;
    } else {
      return result;
    }
  }
  dateToString(date: Date): string {
    return moment(date).format('MM/DD/YYYY').toString();
  }
}
