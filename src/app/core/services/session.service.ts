import { User } from '@synergy-app/shared/models/user.model';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@synergy/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('id_token');
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  _login: Observable<boolean>;
  _role: Observable<any>;
  auth: boolean;
  role: number;
  api = environment.apiUrl;
  url = environment.siteUri;
  token = '';
  jwtHelper = new JwtHelperService({
    tokenGetter: tokenGetter,
  });

  constructor(protected http: HttpClient) {}
  login(user: string, password: string) {
    return this.http
      .post<User>(this.url + '/api/login', { user, password })
      .pipe(
        tap((res) => this.setSession(res)),
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
    return this.http.post(this.api + '/signup', body, { headers: headers });
  }
  isAuthorized(allowedRoles: string[]): boolean {
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }
    if (!this.decodeToken()) {
      return false;
    }
    return allowedRoles.includes(this.getRole());
  }
  getToken() {
    return localStorage.getItem('id_token');
  }
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
  getRights() {
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
    return this.http.get(this.api + '/weather');
  }
}
