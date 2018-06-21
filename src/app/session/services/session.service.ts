import { User} from '../User';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map, publishReplay, refCount, shareReplay} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable()
export class SessionService {
    _login: Observable<boolean>;
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

    isLoggedIn(): boolean {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('userId');
      let res = false;
      this.checkLogin(token, id).subscribe((data: boolean) =>  res = data , error => res = false );
      return res;
    }
    checkRole(param: string) {
      let res = false;
      switch (param) {
        case 'edit': res = (this.role >= 3 ) ? true : false;
          break;
        case 'save': res = (this.role >= 3 ) ? true : false;
          break;
        case 'delete': res = (this.role >= 4 ) ? true : false;
          break;
        default: res = false;
          break;
      }
      return res;
    }
    checkLogin(token: string, id: string) {
      let params = new HttpParams().set('token', token);
      params = params.set('id', id);
      if (!this._login) {
        return this._login = this.http.get<boolean>(this.Uri + '/user/verify', {params: params}).pipe(publishReplay(1), refCount());
      }
      return this._login;
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
            this.role = parseInt(data['userRole'], 10);
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
      this._login = null;
      this._role = null;
      this.role = null;
      this.auth = false;
  }
}
