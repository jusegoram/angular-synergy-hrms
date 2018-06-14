import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseType, ResponseContentType } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Department, Position, Client, Campaign } from '../employee/models/positions-models';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { publishReplay, refCount, map} from 'rxjs/operators';

@Injectable()
export class AdminService {
    constructor(private http: Http, protected httpClient: HttpClient) { }
    siteURI = environment.siteUri;
    _departments: Observable<any> = null;
    _clients: Observable<any> = null;
  getDepartment(): Observable<any> {
    if (!this._departments) {
      this._departments = this.httpClient.get<any>(this.siteURI + '/payroll/department').pipe(
        map((data) => {
          data.forEach(element => {
             element.state = 'saved';
          });
         // console.log(data);
         return data;
        }),
        publishReplay(1),
        refCount()
      );
    }
    return this._departments;
  }

  // saveDepartment(department: Department) {
  //     const token = localStorage.getItem('token')
  //         ? '?token=' + localStorage.getItem('token') : '';
  //     const body = JSON.stringify(department);
  //     const headers = new Headers({ 'Content-Type': 'application/json' });
  //     return this.http.post(this.siteURI + '/payroll/department' + token, body, { headers: headers })
  //         .map((response: Response) => response.json())
  //         .catch((error: Response) => Observable.throw(error.json()));
  // }

  saveDepartment(department: Department) {
    const body = JSON.stringify(department);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('token', localStorage.getItem('token'));
    return this.httpClient.post(this.siteURI + '/payroll/department', body, { headers: headers, params: params });
  }

  updateDepartment(department: Department) {
    const body = JSON.stringify(department);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', department._id);
    return this.httpClient.put(this.siteURI + '/payroll/department', body, { headers: headers, params: params });
  }

  // getting and setting clients and campaigns
  getClient(): Observable<any> {
    if (!this._clients) {
      this._clients = this.httpClient.get<any>(this.siteURI + '/admEmp/client').pipe(
        map((data) => {
          data.state = 'saved';
          return data;
        }),
        publishReplay(1),
        refCount()
      );
    }
    return this._clients;
  }
  // saveClient(client: Client) {
  //     const token = localStorage.getItem('token')
  //         ? '?token=' + localStorage.getItem('token') : '';
  //     const body = JSON.stringify(client);
  //     const headers = new Headers({ 'Content-Type': 'application/json' });
  //     return this.http.post(this.siteURI + '/admEmp/client' + token, body, { headers: headers })
  //         .map((response: Response) => response.json())
  //         .catch((error: Response) => Observable.throw(error.json()));
  // }

  saveClient(client: Client) {
    const body = JSON.stringify(client);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('token', localStorage.getItem('token'));
    return this.httpClient.post(this.siteURI + '/admEmp/client', body, { headers: headers, params: params });
  }

  // updateClient(client: Client) {
  //     const body = JSON.stringify(client);
  //         const headers = new Headers({ 'Content-Type': 'application/json' });
  //         const params = new HttpParams().set('id', department._id);
  //         return this.http.put(this.siteURI + '/admEmp/client'  + , body, { headers: headers })
  //             .map((response: Response) => response.json())
  //             .catch((error: Response) => Observable.throw(error.json()));
  // }

  updateClient(client: Client) {
    const body = JSON.stringify(client);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('id', client._id);
    return this.httpClient.put(this.siteURI + '/admEmp/client', body, { headers: headers, params: params });
  }
}
