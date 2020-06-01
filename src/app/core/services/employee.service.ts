import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { API, environment } from '@synergy/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SessionService } from '@synergy-app/core/services/session.service';
import { TrackerStatusPipe, TrackerTypePipe } from '@synergy-app/shared/pipes';
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
  LeaveRequest,
  HrTracker
} from '@synergy-app/shared/models';
import { TIME_VALUES, LABORAL, SOCIAL } from '@synergy/environments';

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
  public status = LABORAL.STATUS;
  public restrictions = LABORAL.RESTRICTIONS;
  public genders = SOCIAL.GENDERS;

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
  getEmployees(onFinalPayment?: boolean, status?: string[]): Observable<Array<Employee>> {
    const contextFilter = this.getDecodedToken().clients;
    let params = new HttpParams();
    if (contextFilter && contextFilter.length > 0) {
      params = params.set('clients', JSON.stringify(contextFilter));
    }
    if (status) {
      params = params.set('status', JSON.stringify(status));
    }
    if (onFinalPayment) {
      params = params.set('onFinalPayment', JSON.stringify(onFinalPayment));
    }
      return this.httpClient
        .get<Array<Employee>>(this.api + '/employee', { params: params });
  }
  getEmployee(param: string): Observable<Employee> {
    return (this._detail = this.httpClient.get<Employee>(`${this.api}/employee/${param}`));
  }

  /**
   *
   *
   * @returns {Observable<Employee>}
   * @memberof EmployeeService
   * @param employee
   * @param fromDate
   * @param toDate
   */

  getEmployeeShift(employee: Employee, fromDate: Date, toDate: Date) {
    const params = new HttpParams()
      .set('employeeId', employee.employeeId.toString(10))
      .set('fromDate', fromDate.toISOString())
      .set('toDate', toDate.toISOString());
    return this.httpClient.get(`${this.api}/employee/${employee._id}/shift`, {
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
  updateEmployee(employee: Partial<Employee>) {
    const body = employee;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(`${this.api}/employee/${employee._id}`, body, {
      headers: headers,
    });
  }
  updateCompany(company: EmployeeCompany) {
    const body = JSON.stringify(company);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(`${this.api}/employee/${company.employee}/company`, body, {
      headers: headers,
    });
  }
  updatePersonal(personal: EmployeePersonal) {
    const body = JSON.stringify(personal);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(`${this.api}/employee/${personal.employee}/personal`, body, {
      headers: headers,
    });
  }
  updatePayroll(payroll: EmployeePayroll) {
    const body = JSON.stringify(payroll);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', payroll._id);

    return this.httpClient.put(`${this.api}/employee/${payroll.employee}/payroll`, body, {
      headers: headers,
      params: params,
    });
  }

  updateEmployeeShift(employee: Employee, shift: any) {
    const body = shift;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', shift._id);
    return this.httpClient.put(`${this.api}/employee/${employee._id}/shift`, body, {
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
    return this.httpClient.post(`${this.api}/employee/`, body, {
      headers: headers,
    });
  }

  saveCompany(company: EmployeeCompany) {
    const body = JSON.stringify(company);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(`${this.api}/employee/${company.employee}/company`, body, {
      headers: headers,
    });
  }

  savePosition(position: { employee: string; position: EmployeePosition }) {
    const body = JSON.stringify(position);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(`${this.api}/employee/${position.employee}/position`, body, {
      headers: headers,
    });
  }

  savePersonal(personal: EmployeePersonal) {
    const body = JSON.stringify(personal);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(`${this.api}/employee/${personal.employee}/personal`, body, {
      headers: headers,
    });
  }
  savePayroll(payroll: EmployeePayroll) {
    const body = JSON.stringify(payroll);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(`${this.api}/employee/${payroll.employee}/payroll`, body, {
      headers: headers,
    });
  }
  saveFamily(family: EmployeeFamily) {
    const body = family;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(`${this.api}/employee/${family.employee}/family`, body, {
      headers: headers,
    });
  }

  saveComment(comment: EmployeeComment) {
    const body = comment;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(`${this.api}/employee/${comment.employee}/comment`, body, {
      headers: headers,
    });
  }

  saveAttrition(attrition: EmployeeAttrition) {
    const body = attrition;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(`${this.api}/employee/${attrition.employee}/attrition`, body, {
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
    const url = `${this.api}/employee/${position.employee}/position/${position.position._id}`;
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

  // availableInformation(query: any) {
  //   const body = JSON.stringify(query);
  //   const headers = new HttpHeaders({'Content-Type': 'application/json' });
  //   return this.httpClient.post(this.api + '/employee/report/information', body, { headers: headers });
  // }

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

  updateLeaveWithDocument(file: File, leaveRequest: Partial<LeaveRequest>, documentType: string) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('documentType', documentType);
    if (leaveRequest.state) {
      formData.append('state', leaveRequest.state + '');
    }
    return this.httpClient.post(API.LEAVE_DOCUMENT(leaveRequest._id), formData).toPromise();
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
