import { SessionService } from './../../session/session.service';
import { Payroll } from '../components/manage/Payroll';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  savePayedPayroll(data){
    const body = {
      'payedEmployees': data,
      'payedPayrolls': data[0].payrolls,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/payroll/pay', body, {
      headers: headers
    });
  }

  getPayedPayrolls(){
    return this.httpClient.get<any>('/api/v1/payroll/pay');
  }

  sendPayslipts(payId){
    const body = {
      payId: payId
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/payroll/payslips', body, {
      headers: headers
    });
  }
  getReport(query: any): Observable<any> {
    const body = query;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/report', body, {
      headers: headers
    });
  }

  getClient(): Observable<any> {
    if (!this._clients) {
      this._clients = this.httpClient
        .get<any>('/api/v1/admin/employee/client')
        .pipe(
          map(data => {
            this._clients = data;
            return data;
          }),
          publishReplay(1),
          refCount()
        );
    }
    return this._clients;
  }

  getEmployeesByPayrollType(payrollType, from, to) {
    //FIX
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
  savePayroll(){
    const body = this.payroll;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/payroll/', body, {
      headers: headers
    });
  }

  getPayroll(id: any, type: any): Observable<any> {
    let params
    if(id.length === 2){
       params = new HttpParams().set('id', id[0]).set('id2', id[1]).set('type', type);
    }else{
      params = new HttpParams().set('id', id).set('type', type);
    }
    return this.httpClient.get<any>('/api/v1/payroll', {params: params});
  }

  getPayedHistory(){
    return this.httpClient.get<any>('/api/v1/payroll/payed');
  }
  deletePayroll() {
    this._payroll = null;
    delete this._payroll;
  }
}
