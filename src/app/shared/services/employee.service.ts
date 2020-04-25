import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { API, environment } from '@synergy/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SessionService } from '@synergy-app/shared/services/session.service';
import { HrTracker } from '@synergy-app/shared/models/hr-tracker';
import { TrackerStatusPipe } from '@synergy-app/shared/pipes/tracker-status.pipe';
import { TrackerTypePipe } from '@synergy-app/shared/pipes/tracker-type.pipe';
import moment from 'moment';
import {
  Employee,
  EmployeeAttrition,
  EmployeeComment,
  EmployeeCompany,
  EmployeeFamily,
  EmployeePayroll,
  EmployeePersonal,
  EmployeePosition,
} from '@synergy-app/shared/models/employee/employee';
import { TIME_VALUES } from '@synergy/environments/enviroment.common';
import { LeaveRequest } from '../models/leave-request';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  api = environment.apiUrl;
  _clients: Observable<any> = null;
  clients: any;
  _departments: Observable<any> = null;
  _employees: Observable<Array<Employee>> = null;
  _detail: Observable<Employee> = null;
  public status = [
    { value: 'active', viewValue: 'Active' },
    {
      value: 'resignation',
      viewValue: 'Resignation',
      onclick: 'openStatusDialog()',
    },
    {
      value: 'dissmisal',
      viewValue: 'Dissmisal',
      onclick: 'openStatusDialog()',
    },
    {
      value: 'termination',
      viewValue: 'Termination',
      onclick: 'openStatusDialog()',
    },
    { value: 'on-hold', viewValue: 'On-Hold' },
    { value: 'transfer', viewValue: 'Transfer' },
    //   { value: 'trainee', viewValue: 'Trainee' }
  ];
  public genders = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' },
  ];

  constructor(
    protected httpClient: HttpClient,
    private sessionService: SessionService,
    private trackerStatusPipe: TrackerStatusPipe,
    private trackerTypePipe: TrackerTypePipe
  ) {}

  getTemplate(templateUrl) {
    return this.httpClient.get(this.api + templateUrl, {
      responseType: 'blob',
    });
  }

  getReport(query: any): Observable<any> {
    const body = query;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/employee/report', body, {
      headers: headers,
    });
  }

  /**
   *
   *
   * @returns {Observable<any>}
   * @memberof EmployeeService
   */

  getClient(contextFilter?: string[]): Observable<any> {
    if (!this._clients) {
      let params;
      if (contextFilter && contextFilter.length > 0) {
        params = new HttpParams().set('clients', JSON.stringify(contextFilter));
      }
      this._clients = this.httpClient
        .get<any>(this.api + '/admin/employee/client', { params: params })
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

  getDepartment(): Observable<any> {
    if (!this._departments) {
      this._departments = this.httpClient
        .get<any>(this.api + '/admin/payroll/department')
        .pipe(publishReplay(1), refCount());
    }
    return this._departments;
  }
  tokenGetter() {
    return 'JWT ' + localStorage.getItem('id_token');
  }

  /**
   *
   *
   * @returns {Observable<Array<Employee>>}
   * @memberof EmployeeService
   */
  getEmployees(): Observable<Array<Employee>> {
    const contextFilter = this.getDecodedToken().clients;
    let params;
    if (contextFilter && contextFilter.length > 0) {
      params = new HttpParams().set('clients', JSON.stringify(contextFilter));
    }
    if (!this._employees) {
      this._employees = this.httpClient
        .get<Array<Employee>>(this.api + '/employee', { params: params })
        .pipe(publishReplay(1), refCount());
    }
    return this._employees;
  }
  getEmployee(param: string): Observable<Employee> {
    const params = new HttpParams().set('id', param);
    return (this._detail = this.httpClient.get<Employee>(this.api + '/employee/main', { params: params }));
  }

  /**
   *
   *
   * @returns {Observable<Employee>}
   * @memberof EmployeeService
   * @param employeeId
   * @param fromDate
   * @param toDate
   */

  getEmployeeShift(employeeId, fromDate, toDate) {
    const params = new HttpParams().set('employeeId', employeeId).set('fromDate', fromDate).set('toDate', toDate);
    return this.httpClient.get(this.api + '/employee/shift', {
      params: params,
    });
  }
  /**
   *
   *
   * @param {Employee} employee
   * @returns
   * @memberof EmployeeService
   */
  updateEmployee(employee: Employee) {
    const body = employee;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(this.api + '/employee/main', body, {
      headers: headers,
    });
  }
  updateCompany(company: EmployeeCompany) {
    const body = JSON.stringify(company);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(this.api + '/employee/company', body, {
      headers: headers,
    });
  }
  updatePersonal(personal: EmployeePersonal) {
    const body = JSON.stringify(personal);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(this.api + '/employee/personal', body, {
      headers: headers,
    });
  }
  updatePayroll(payroll: EmployeePayroll) {
    const body = JSON.stringify(payroll);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', payroll._id);

    return this.httpClient.put(this.api + '/employee/payroll', body, {
      headers: headers,
      params: params,
    });
  }

  updateEmployeeShift(shift) {
    const body = shift;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', shift._id);

    return this.httpClient.put(this.api + '/employee/shift', body, {
      headers: headers,
      params: params,
    });
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
    return this.httpClient.post(this.api + '/employee/new', body, {
      headers: headers,
    });
  }

  saveCompany(company: EmployeeCompany) {
    const body = JSON.stringify(company);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/employee/company', body, {
      headers: headers,
    });
  }

  savePosition(position: { employee: string; position: EmployeePosition }) {
    const body = JSON.stringify(position);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/employee/position', body, {
      headers: headers,
    });
  }

  savePersonal(personal: EmployeePersonal) {
    const body = JSON.stringify(personal);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/employee/personal', body, {
      headers: headers,
    });
  }
  savePayroll(payroll: EmployeePayroll) {
    const body = JSON.stringify(payroll);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/employee/payroll', body, {
      headers: headers,
    });
  }
  saveFamily(family: EmployeeFamily) {
    const body = family;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/employee/family', body, {
      headers: headers,
    });
  }

  saveComment(comment: EmployeeComment) {
    const body = comment;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/employee/comment', body, {
      headers: headers,
    });
  }

  saveAttrition(attrition: EmployeeAttrition) {
    const body = attrition;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/employee/attrition', body, {
      headers: headers,
    });
  }

  /**
   *
   *
   * @memberof EmployeeService
   */
  clearEmployees() {
    this._employees = null;
  }

  getAuth() {
    return this.sessionService.getRights();
  }

  getDecodedToken() {
    return this.sessionService.decodeToken();
  }

  deletePosition(position: { employee: string; position: EmployeePosition }) {
    const url = `${this.api}/employee/position?position=${position.position._id}&employee=${position.employee}`;
    return this.httpClient.delete(url);
  }

  deleteFamily(family: EmployeeFamily) {
    const url = `${this.api}/employee/${family.employee}/family/${family._id}`;
    return this.httpClient.delete(url);
  }

  deleteComment(comment: EmployeeComment) {
    const url = `${this.api}/employee/${comment.employee}/comment/${comment._id}`;
    return this.httpClient.delete(url);
  }

  deleteAttrition(attrition: EmployeeAttrition) {
    const url = `${this.api}/employee/${attrition.employee}/attrition/${attrition._id}`;
    return this.httpClient.delete(url);
  }

  availableInformation(query: any) {
    const body = JSON.stringify(query);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.api + '/employee/report/information', body, { headers: headers });
  }

  // TODO: feat/leaves
  getLeaves(filters = {}): Promise<Array<LeaveRequest>> {
    return this.httpClient
      .get<Array<LeaveRequest>>(API.LEAVES, { params: filters })
      .toPromise();
  }

  saveLeave(leaveRequest: Partial<LeaveRequest>) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(API.LEAVES, leaveRequest, { headers }).toPromise();
  }

  updateLeave(leaveRequest: Partial<LeaveRequest>) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(API.LEAVE(leaveRequest._id), leaveRequest, { headers }).toPromise();
  }

  deleteLeave(_id: string) {
    return this.httpClient.delete(API.LEAVE(_id)).toPromise();
  }

  getLeave(_id: string) {
    return this.httpClient.get(API.LEAVE(_id)).toPromise();
  }

  /**@todo: feat/hr-module
   * @function saveTracker
   *
   * @function deleteTracker
   *
   * @function getTracker
   *
   * employeeId: from employee-mains
   * employee: _id of employee-mains
   * requestDate: 3 days after current date
   * state: default 0 - means 'Open'
   * tracker: Object from trackerSchema
   * creation fingerprint: current user decodedToken
   * verificationFingerprint: current hr module user who fulfills the tracker
   * @param hrTracker
   */

  saveTracker(hrTracker: HrTracker) {
    // TODO: feat/hr-module
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(API.TRACKERS, hrTracker, { headers }).toPromise();
  }

  updateTracker(hrTracker: Partial<HrTracker>) {
    // TODO: feat/hr-module
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(API.TRACKER(hrTracker._id), hrTracker, { headers }).toPromise();
  }

  deleteTracker(employeeId: string) {
    // TODO: feat/hr-module
    return this.httpClient.delete(API.TRACKER(employeeId)).toPromise();
  }

  getTracker(employeeId: string) {
    // TODO: feat/hr-module
    return this.httpClient.get(API.TRACKER(employeeId)).toPromise();
  }

  getTrackers(filters = {}): Promise<Array<HrTracker>> {
    // TODO: feat/hr-module
    return this.httpClient
      .get<Array<HrTracker>>(API.TRACKERS, { params: filters })
      .pipe(
        map((hrTrackers: Array<HrTracker>) => {
          return this.mapHrTrackersData(hrTrackers);
        })
      )
      .toPromise();
  }

  private mapHrTrackersData(hrTrackers: Array<HrTracker>): Array<HrTracker> {
    return hrTrackers.map((hrTracker: HrTracker) => {
      hrTracker.stateName = this.trackerStatusPipe.transform(hrTracker.state);
      hrTracker.trackerTypeName = this.trackerTypePipe.transform(hrTracker.tracker);
      hrTracker.requestDateFormatted = moment(hrTracker.requestDate).format('MM/DD/YYYY');
      hrTracker.deadlineDateFormatted = moment(hrTracker.requestDate)
        .add(TIME_VALUES.THREE_DAYS, 'days')
        .format('MM/DD/YYYY');

      if (hrTracker.tracker.certifyTraining) {
        hrTracker.tracker.certifyTraining.managerSignature = this.bufferToBase64(
          hrTracker.tracker.certifyTraining.managerSignature
        );
        return hrTracker;
      }

      if (hrTracker.tracker.statusChange) {
        hrTracker.tracker.statusChange.managerSignature = this.bufferToBase64(
          hrTracker.tracker.statusChange.managerSignature
        );
        hrTracker.tracker.statusChange.supervisorSignature = this.bufferToBase64(
          hrTracker.tracker.statusChange.supervisorSignature
        );
        return hrTracker;
      }

      if (hrTracker.tracker.transfer) {
        hrTracker.tracker.transfer.managerSignature = this.bufferToBase64(hrTracker.tracker.transfer.managerSignature);
        return hrTracker;
      }

      return hrTracker;
    });
  }

  private bufferToBase64(buffer) {
    return String.fromCharCode.apply(null, buffer.data).toString('base64');
  }

  getEmployeeManagers(clients: string[]) {
    const params = new HttpParams().set('clients', JSON.stringify(clients));
    return this.httpClient.get(this.api + '/employee/managers', { params: params });
  }
}
