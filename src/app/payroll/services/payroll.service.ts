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
    { value: 'undefined', viewValue: 'Undefined' },
 //   { value: 'trainee', viewValue: 'Trainee' }
  ];
  _clients: Observable<any> = null;

  constructor(private httpClient: HttpClient) { }

  getReport(query: any): Observable<any> {
    // const body = query;
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // return this.httpClient.post('/api/v1/employee/report', body, { headers: headers }).pipe(
    //   map((data: any) => {
    //   data.forEach(element => {
    //     delete element.__v;
    //       if (element.employee !== null) {
    //     const employee = element.employee;
    //     delete element.employee;
    //     element._id = employee._id;
    //     element.firstName = employee.firstName;
    //     element.middleName = employee.middleName;
    //     element.lastName = employee.lastName;
    //     element.gender = employee.gender;
    //     element.socialSecurity = employee.socialSecurity;
    //     element.status = employee.status;
    //     element.position = employee.position[employee.position.length - 1];
    //     element.shift = employee.shift[employee.shift.length - 1];
    //     element.personal = employee.personal;
    //     element.education = employee.education;
    //     element.comments = employee.comments;
    //     element.family = employee.family;
    //     element.payroll = employee.payroll;
    //     }else {
    //     delete element.employee;
    //     }
    //   });
    //   return  data;
    //   })
    // );
    const body = query;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/employee/report', body, { headers: headers });
  }

  getClient(): Observable<any> {
    if (!this._clients) {
      this._clients = this.httpClient.get<any>('/api/v1/admin/employee/client').pipe(
        map((data) => {
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
    return this.httpClient.get<any>(`/api/v1/payroll/getPayroll?payrollType=${payrollType}&from=${from}&to=${to}`);
  }

  getOtherPayrollInfo(employees: any, payroll: any, from: any, to: any) {
    let query = {
      employees: employees,
      payrollType: payroll,
      from: from,
      to: to,
    }
    const body = query;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post('/api/v1/payroll/getOtherPayrollInfo', body, { headers: headers });
  }

  getHours(from: any, to: any) {

    let params = new HttpParams().set('gte', from);
    params.set('lte', to);
    return this.httpClient.get<any>('/api/v1/payroll/getHours', {params: params});

  }
}
