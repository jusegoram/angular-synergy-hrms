import { IUser} from '../User';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SessionService {
    role: number;
    public authBS = new BehaviorSubject<boolean>(false);
    constructor(private http: Http) {}

    signup(user: IUser) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://blink-test.herokuapp.com/user', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    signin(user: IUser) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://blink-test.herokuapp.com/user/signin', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));

    }

    logout() {
        localStorage.clear();
        this.role = null;
        this.authBS.next(false);
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
    getRole () {
        const token = localStorage.getItem('token')
        ? '?token=' + localStorage.getItem('token')
        : '';
    return this.http.get('https://blink-test.herokuapp.com/user/role' + token)
       .map(
           (response: Response) => {
            let resultRole: number;
            resultRole = parseInt(response.json().userRole, 10);
            return resultRole;
        }).catch((err: Response) => Observable.throw(err));
    }

    getAuth(): Observable<any> {
    return this.authBS.asObservable();
    }
}
