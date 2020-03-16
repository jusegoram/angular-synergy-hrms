import { SessionService } from './../../session/session.service';
import { Payroll } from '../components/manage/Payroll';
import { Injectable } from '@angular/core';
import { Observable, noop } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, publishReplay, refCount } from 'rxjs/operators';

@Injectable()
export class PayrollService {

  public status = [
    { value: 'active', viewValue: 'Active' },
    { value: 'resignation', viewValue: 'Resignation' },
    { value: 'dissmisal', viewValue: 'Dissmisal' },
    { value: 'termination', viewValue: 'Termination' },
    { value: 'on-hold', viewValue: 'On-Hold' },
    { value: 'transfer', viewValue: 'Transfer' },
    { value: 'undefined', viewValue: 'Undefined' }
    //   { value: 'trainee', viewValue: 'Trainee' }
  ];
  _clients: Observable<any> = null;
  _payroll: Payroll;
  _employees: Observable<any> = null;

  constructor(private httpClient: HttpClient, private _sessionService: SessionService) {}

  getAuth(): any {
    return this._sessionService.getRights();

  }

  public get payroll() {
    return this._payroll;
  }

  public setPayroll(
    employees,
    fromDate,
    toDate,
    socialTable,
    holidayTable,
    exceptionsTable,
    otherpayTable,
    deductionsTable,
    incometaxTable
  ) {
    this._payroll = new Payroll(
      employees,
      fromDate,
      toDate,
      socialTable,
      holidayTable,
      exceptionsTable,
      otherpayTable,
      deductionsTable,
      incometaxTable
    );
  }

  savePayedPayroll(data) {
    const body = {
      'payedEmployees': data,
      'payedPayrolls': data[0].payrolls,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/payroll/pay', body, {
      headers: headers
    });
  }

  sendPayslipts(payId) {
    const body = {
      payId: payId
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/payroll/payslips', body, {
      headers: headers
    });
  }

  getPayslip(employee, payId) {
    const params = new HttpParams().set('payId', payId);
    return this.httpClient.get<any>(`/api/v1/payroll/payslips/${employee}`, {
      params: params
    });
  }

  getReport(query: any): Observable<any> {
    const body = query;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/report', body, {
      headers: headers
    });
  }

  getClient(contextFilter?: string[]): Observable<any> {
    if (!this._clients) {
      let params;
      if (contextFilter && contextFilter.length > 0) {
         params = new HttpParams().set('clients', JSON.stringify(contextFilter));
      }
      this._clients = this.httpClient.get<any>('/api/v1/admin/employee/client' , { params: params }).pipe(
        map((data) => {
          return data;
        }),
        publishReplay(1),
        refCount()
      );
    }
    return this._clients;
  }

  getDecodedToken() {
    return this._sessionService.decodeToken();
  }
  getEmployeesByPayrollType(payrollType, from, to) {
    // FIX-ME: fix this
    return this.httpClient.get<any>(
      `/api/v1/payroll/getPayroll?payrollType=${payrollType}&from=${from}&to=${to}`
    );
  }

  getOtherPayrollInfo(employees: any, payroll: any, from: any, to: any) {
    const query = {
      employees: employees,
      payrollType: payroll,
      from: from,
      to: to
    };
    const body = query;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/payroll/getOtherPayrollInfo', body, {
      headers: headers
    });
  }

  getHours(from: any, to: any) {
    const params = new HttpParams().set('gte', from).set('lte', to);
    return this.httpClient.get<any>('/api/v1/payroll/getHours', {
      params: params
    });
  }

  getPayrollSettings(from, to) {
    return this.httpClient.get<any>(`/api/v1/payroll/settings?from=${from}&to=${to}`);
  }

  getLastYearPayrolls(id: any) {
    const params = new HttpParams().set('id', id);
    return this.httpClient.get<any>('/api/v1/payroll/employees', {
      params: params
    });
  }
  savePayroll(payroll) {
    const body = {
      payroll: payroll,
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/payroll/', body, {
      headers: headers
    });
  }
  updatePayroll(payroll, element, type, payrollRecordId?) {
    const body = element;
    const params = new HttpParams().set('conceptType', type).set('payrollRecordId', payrollRecordId);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put('/api/v1/payroll/' + payroll, body, {headers: headers, params: params});
  }

  getPayroll(id: any, type: any, finalized: any, payed?: any): Observable<any> {
    let params;
      params = new HttpParams().set('id', id).set('type', type).set('finalized', finalized).set('payed', payed);
    return this.httpClient.get<any>('/api/v1/payroll', {params: params});
  }

  getPayedHistory() {
    return this.httpClient.get<any>('/api/v1/payroll/payed');
  }
  deletePayroll() {
    this._payroll = null;
    delete this._payroll;


  }

  getConcepts(arg: {
    type?: string, id?: string, verified?: boolean,
    payed?: boolean, maternity?: boolean, csl?: boolean,
    notice?: boolean, severance?: boolean, compassionate?: boolean,
    leaveWithoutPay?: boolean, vacations?: boolean, assigned?: boolean, taxable?: boolean , payroll?: string}) {
    const {type, id, verified,
      payed, maternity, csl,
      notice, severance, compassionate,
      leaveWithoutPay, vacations, assigned, taxable, payroll} = arg;
    // if id === 'all' then all employees are fetched
    let params = new HttpParams();
    params = verified !== undefined && verified !== null ? params.set('verified', verified + '') : params;
    params = payed  !== undefined && payed  !== null ? params.set('payed', payed + '') : params;
    params = maternity !== undefined && maternity !== null ? params.set('maternity', maternity + '')  : params;
    params = csl !== undefined && csl !== null ? params.set('csl', csl + '') : params;
    params = notice !== undefined && notice !== null ? params.set('notice', notice + '') : params;
    params = severance !== undefined && severance !== null ? params.set('severance', severance + '') : params;
    params = compassionate !== undefined && compassionate !== null ? params.set('compassionate', compassionate + '') : params;
    params = leaveWithoutPay !== undefined && leaveWithoutPay !== null ? params.set('LeaveWithoutPay', leaveWithoutPay + '') : params;
    params = vacations !== undefined && vacations !== null ? params.set('vacations', vacations + '') : params;
    params = assigned !== undefined && assigned !== null ? params.set('assigned', assigned + '') : params;
    params = payroll !== undefined && payroll !== null ? params.set('payroll', payroll) : params;
    params = taxable !== undefined && taxable !== null ? params.set('taxable', taxable + '') : params;



    return this.httpClient.get<any>(`/api/v1/payroll/concepts/${type}/${id}`, {
      params: params
    });
  }

  saveConcept(concept) {
    const {type, employee} = concept;
    const body = concept;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(`/api/v1/payroll/concepts/${type}/${employee}`, body, {
      headers: headers
    });
  }
  updateConcept({type, id, query}) {
    const body = {id, query};
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(`/api/v1/payroll/concepts/${type}`, body, {headers: headers});
  }
  deleteConcept({type, id}) {
    const params = new HttpParams().set('id', id);
    return this.httpClient.delete(`/api/v1/payroll/concepts/${type}`, {params: params});
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
  getUser() {
    return this._sessionService.decodeToken();
  }


}
