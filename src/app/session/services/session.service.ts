import { User} from '../User';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map, publishReplay, refCount, shareReplay} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable()
export class SessionService {
    _role: Observable<any>;
    auth: boolean;
    role: number;
    Uri = environment.siteUri;
    constructor(private http: HttpClient) {
      this.auth = false;
      this._role = null;
      this.role = null;
    }

    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post( this.Uri + '/user', body, {headers: headers});
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post( this.Uri + '/user/signin', body, {headers: headers});
    }

    logout() {
        localStorage.clear();
        this.clearRole();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
    // getRole () {
    //     const token = localStorage.getItem('token')
    //     ? '?token=' + localStorage.getItem('token')
    //     : '';
    // return this.http.get( this.Uri + '/user/role' + token)
    //    .map(
    //        (response: Response) => {
    //         let resultRole: number;
    //         resultRole = parseInt(response.json().userRole, 10);
    //         return resultRole;
    //     }).catch((err: Response) => Observable.throw(err));
    // }

  getRole() {
    if ( !this._role) {
      const token = localStorage.getItem('token');
      const params = new HttpParams().set('token', token);
      this._role = this.http.get(this.Uri + '/user/role', {params: params})
        .pipe(
          map(data => {
            data = parseInt(data['userRole'], 10);
            this.auth = data['canEdit'];
            return data;
          }),
          publishReplay(1),
          refCount()
        );
    }
    return this._role;
  }

  clearRole() {
      this._role = null;
      this.role = null;
      this.auth = false;
  }
}
