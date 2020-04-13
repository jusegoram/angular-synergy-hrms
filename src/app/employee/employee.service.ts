import {
  Employee,
  EmployeeAttrition,
  EmployeeComment,
  EmployeeCompany,
  EmployeeFamily,
  EmployeePayroll,
  EmployeePersonal,
  EmployeePosition,
} from '../shared/models/employee/employee';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, publishReplay, refCount} from 'rxjs/operators';
import {API, environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {SessionService} from '../session/session.service';
import {HrTracker} from '../shared/models/hr-tracker';

export class Store {
  constructor(public id: string, public obs: Observable<any>) {
  }

  getObservable(): Observable<any> {
    return this.obs;
  }
}

@Injectable()
export class EmployeeService {
  api = environment.apiUrl;
  _clients: Observable<any> = null;
  clients: any;
  store: Store[];
  _departments: Observable<any> = null;
  _employees: Observable<Array<Employee>> = null;
  _detail: Observable<Employee> = null;
  public status = [
    {value: 'active', viewValue: 'Active'},
    {
      value: 'resignation',
      viewValue: 'Resignation',
    },
    {
      value: 'dissmisal',
      viewValue: 'Dissmisal',
    },
    {
      value: 'termination',
      viewValue: 'Termination',
    },
    {value: 'on-hold', viewValue: 'On-Hold'},
    {value: 'transfer', viewValue: 'Transfer'},
    //   { value: 'trainee', viewValue: 'Trainee' }
  ];
  public reaptimes = [
    {value: 0, viewValue: '0'},
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
    {value: 4, viewValue: '4'},
    {value: 5, viewValue: '5'},
    {value: 6, viewValue: '6'},
    {value: 7, viewValue: '7'},
    {value: 8, viewValue: '8'},
    {value: 9, viewValue: '9'},
    {value: 10, viewValue: '10'},
  ];
  public genders = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'},
  ];

  constructor(
    protected httpClient: HttpClient,
    private sessionService: SessionService
  ) {
    this.store = [];
  }

  getTemplate(templateUrl) {
    return this.httpClient.get(this.api + templateUrl, {
      responseType: 'blob',
    });
  }

  getReport(query: any): Observable<any> {
    const body = query;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
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

  getDepartment(): Observable<any> {
    if (!this._departments) {
      this._departments = this.httpClient
        .get<any>(this.api + '/admin/payroll/department')
        .pipe(publishReplay(1), refCount());
    }
    return this._departments;
  }

  // getShift(): Observable<any> {
  //   if (!this._shift) {
  //     this._shift = this.httpClient
  //       .get<any>(this.api + '/admin/employee/shift')
  //       .pipe(publishReplay(1), refCount());
  //   }
  //   return this._shift;
  // }
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
        .get<Array<Employee>>(this.api + '/employee', {params: params})
        .pipe(publishReplay(1), refCount());
    }
    return this._employees;
  }

  getEmployee(param: string): Observable<Employee> {
    const params = new HttpParams().set('id', param);
    return (this._detail = this.httpClient.get<Employee>(
      this.api + '/employee/main',
      {params: params}
    ));
  }


  /**
   *
   *
   * @param {string} param
   * @returns {Observable<Employee>}
   * @memberof EmployeeService
   */

  getEmployeeShift(employeeId, fromDate, toDate) {
    const params = new HttpParams()
      .set('employeeId', employeeId)
      .set('fromDate', fromDate)
      .set('toDate', toDate);
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
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams().set('id', employee._id);
    return this.httpClient.put(this.api + '/employee/main', body, {
      headers: headers,
    });
  }
  updateCompany(company: EmployeeCompany) {
    const body = JSON.stringify(company);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put(this.api + '/employee/company', body, {
      headers: headers,
    });
  }
  updatePersonal(personal: EmployeePersonal) {
    const body = JSON.stringify(personal);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put(this.api + '/employee/personal', body, {
      headers: headers,
    });
  }
  updatePayroll(payroll: EmployeePayroll) {
    const body = JSON.stringify(payroll);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams().set('id', payroll._id);

    return this.httpClient.put(this.api + '/employee/payroll', body, {
      headers: headers,
      params: params,
    });
  }

  updateEmployeeShift(shift) {
    const body = shift;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
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
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.api + '/employee/new', body, {
      headers: headers,
    });
  }

  saveCompany(company: EmployeeCompany) {
    const body = JSON.stringify(company);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.api + '/employee/company', body, {
      headers: headers,
    });
  }

  savePosition(position: { employee: string; position: EmployeePosition }) {
    const body = JSON.stringify(position);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.api + '/employee/position', body, {
      headers: headers,
    });
  }

  savePersonal(personal: EmployeePersonal) {
    const body = JSON.stringify(personal);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.api + '/employee/personal', body, {
      headers: headers,
    });
  }
  savePayroll(payroll: EmployeePayroll) {
    const body = JSON.stringify(payroll);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.api + '/employee/payroll', body, {
      headers: headers,
    });
  }
  saveFamily(family: EmployeeFamily) {
    const body = family;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.api + '/employee/family', body, {
      headers: headers,
    });
  }

  saveComment(comment: EmployeeComment) {
    const body = comment;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.api + '/employee/comment', body, {
      headers: headers,
    });
  }

  saveAttrition(attrition: EmployeeAttrition) {
    const body = attrition;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
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

  clearAvatar(param: string) {
    const i = this.store.findIndex((res) => res.id === param);
    this.store.splice(i, 1);
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
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(
      this.api + '/employee/report/information',
      body,
      {headers: headers}
    );
  }


  /**@todo: feat/hr-module
   * @function saveTracker
   * @param {hr-tracker} tracker
   *
   * @function deleteTracker
   * @param {hr-tracker} tracker._id
   *
   * @function getTracker
   * @param {hr-tracker} employee || employeeId
   *
   * employeeId: from employee-mains
   * employee: _id of employee-mains
   * requestDate: 3 days after current date
   * state: default 0 - means 'Open'
   * tracker: Object from trackerSchema
   * creation fingerprint: current user decodedToken
   * verificationFingerprint: current hr module user who fulfills the tracker
   */

  saveTracker(hrTracker: HrTracker) {
    // TODO: feat/hr-module
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient
      .post(API.TRACKERS, hrTracker, { headers })
      .toPromise();
  }

  deleteTracker(employeeId: string) {
    // TODO: feat/hr-module
    return this.httpClient.delete(API.TRACKER(employeeId)).toPromise();
  }

  getTracker(employeeId: string) {
    // TODO: feat/hr-module
    return this.httpClient.get(API.TRACKER(employeeId)).toPromise();
  }

  getTrackers() {
    // TODO: feat/hr-module
    return this.httpClient.get(API.TRACKERS).toPromise();
  }

  getEmployeeManagers(clients: string[]) {
    const params = new HttpParams().set('clients', JSON.stringify(clients));
    return this.httpClient.get(this.api + '/employee/managers', {params: params});
  }
}
