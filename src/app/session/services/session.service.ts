import { User } from '../User';
import { Injectable, OnInit } from '@angular/core';
import * as moment from 'moment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, publishReplay, refCount, shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable()
export class SessionService {
      _login: Observable<boolean>;
      _role: Observable<any>;
      auth: boolean;
      role: number;
      Uri = environment.siteUri;
      token = '';
  //     constructor(private http: HttpClient) {
  //       if ( typeof(this.auth) === 'undefined' ) {
  //         this.afterLogin();
  //       }
  //     }

  //     ngOnInit() {
  //       if ( this.auth === false ) {
  //         this.afterLogin();
  //       }
  //     }

  //     signup(user: User) {
  //         const body = JSON.stringify(user);
  //         const headers = new HttpHeaders({'Content-Type': 'application/json'});
  //         return this.http.post( this.Uri + '/user', body, {headers: headers});
  //     }

  //     signin(user: User) {
  //         const body = JSON.stringify(user);
  //         const headers = new HttpHeaders({'Content-Type': 'application/json'});
  //         return this.http.post( this.Uri + '/user/signin', body, {headers: headers});
  //     }

  //     logout() {
  //         localStorage.clear();
  //         this.clearRole();
  //     }
  // //FIXME: is logged in can not be an observable. this check has to be done async
  //     getAuth(): boolean {
  //       if (localStorage.getItem('token') && localStorage.getItem('userId')) {
  //         this.afterLogin();
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }

  //     checkRole(param: string) {
  //       let res = false;
  //       switch (param) {
  //         case 'edit': res = (this.role >= 3 ) ? true : false;
  //           break;
  //         case 'save': res = (this.role >= 3 ) ? true : false;
  //           break;
  //         case 'delete': res = (this.role >= 4 ) ? true : false;
  //           break;
  //         default: res = false;
  //           break;
  //       }
  //       return res;
  //     }
  //     setAuth(param: boolean) {
  //       this.auth = param;
  //     }
  //     afterLogin() {
  //       const token = localStorage.getItem('token');
  //       const id = localStorage.getItem('userId');
  //       this.checkLogin(token, id).subscribe((data: boolean) =>  {
  //         this.setAuth(data);
  //         if (! data ) {
  //           this.logout();
  //         }
  //       },
  //        error => console.log(error));
  //     }
  //     checkLogin(token: string, id: string) {
  //       let params = new HttpParams().set('token', token);
  //       params = params.set('id', id);
  //       if (!this._login) {
  //         return this._login = this.http.get<boolean>(this.Uri + '/user/verify', {params: params}).pipe(publishReplay(1), refCount());
  //       }
  //       return this._login;
  //     }
  //     // getRole () {
  //     //     const token = localStorage.getItem('token')
  //     //     ? '?token=' + localStorage.getItem('token')
  //     //     : '';
  //     // return this.http.get( this.Uri + '/user/role' + token)
  //     //    .map(
  //     //        (response: Response) => {
  //     //         let resultRole: number;
  //     //         resultRole = parseInt(response.json().userRole, 10);
  //     //         return resultRole;
  //     //     }).catch((err: Response) => Observable.throw(err));
  //     // }

  //   getRole() {
  //     if ( !this._role) {
  //       const token = localStorage.getItem('token');
  //       const params = new HttpParams().set('token', token);
  //       this._role = this.http.get(this.Uri + '/user/role', {params: params})
  //         .pipe(
  //           map(data => {
  //             data = parseInt(data['userRole'], 10);
  //             this.role = parseInt(data['userRole'], 10);
  //             this.auth = data['canEdit'];
  //             return data;
  //           }),
  //           publishReplay(1),
  //           refCount()
  //         );
  //     }
  //     return this._role;
  //   }

  //   clearRole() {
  //       this._login = null;
  //       this._role = null;
  //       this.role = null;
  //       this.auth = false;
  //   }
  constructor(protected http: HttpClient, protected jwtHelper: JwtHelperService) {

  }
  login(user: string, password: string) {
    return this.http.post<User>('/api/v1/login', { user, password }).pipe(
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
    permission() {
      if (this.isLoggedIn()) {
        // const val: string;
        // switch (val) {
        //   case 'edit': return (this.getRole() >= 3) ? true : false;
        //   case 'delete': return (this.getRole() >= 4) ? true : false;
        //   case 'view': return (this.getRole() >= 0) ? true : false;
        //   default: return false;
          const auth = {
            edit: (this.getRole() >= 3) ? true : false,
            delete: (this.getRole() >= 4) ? true : false,
            view: (this.getRole() >= 0) ? true : false
          };
          return auth;
        }else {
        return false;
      }
    }
    decodeToken() {
      const currToken = this.jwtHelper.tokenGetter();
      return this.jwtHelper.decodeToken(currToken);
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
    clearRole() {
        this._login = null;
        this._role = null;
        this.role = null;
        this.auth = false;
    }
}
