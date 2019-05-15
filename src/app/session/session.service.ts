import { User } from './User';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('id_token');
}
@Injectable()
export class SessionService {
  _login: Observable<boolean>;
  _role: Observable<any>;
  auth: boolean;
  role: number;
  Uri = environment.siteUri;
  token = '';
  jwtHelper = new JwtHelperService({
    tokenGetter: tokenGetter

  });

  constructor(protected http: HttpClient) {

  }
  login(user: string, password: string) {
    return this.http.post<User>('/login', { user, password }).pipe(
      tap(res => this.setSession(res)),
      shareReplay()
    );

  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }

  isLoggedOut() {
    return this.jwtHelper.isTokenExpired();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
  signup(user: User) {
    const body = JSON.stringify(user);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post('/api/v1/signup', body, { headers: headers });
  }
  // permission() {
  //   if (this.isLoggedIn()) {
  //     // const val: string;
  //     // switch (val) {
  //     //   case 'edit': return (this.getRole() >= 3) ? true : false;
  //     //   case 'delete': return (this.getRole() >= 4) ? true : false;
  //     //   case 'view': return (this.getRole() >= 0) ? true : false;
  //     //   default: return false;
  //     // };
  //     console.log(this.getRights());
  //     const auth = {
  //       edit: (this.getRole() >= 3) ? true : false,
  //       delete: (this.getRole() >= 4) ? true : false,
  //       view: (this.getRole() >= 0) ? true : false
  //     };
  //     return auth;
  //   } else {
  //     return false;
  //   }
  // }
  decodeToken() {
    return this.jwtHelper.decodeToken();
  }
  getRole() {
    const dec = this.decodeToken();
    return dec.role;
  }
  getName() {
    const dec = this.decodeToken();
    return dec.name;
  }
  getId() {
    const dec = this.decodeToken();
    return dec.userId;
  }
  getRights(){
    const dec = this.decodeToken();
    dec.rights.role = this.getRole();
    return dec.rights;
  }
  clearRole() {
    this._login = null;
    this._role = null;
    this.role = null;
    this.auth = false;
  }
  getWeather() {
    return this.http.get('/api/v1/weather');
  }

}
