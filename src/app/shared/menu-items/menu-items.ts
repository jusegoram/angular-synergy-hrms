import { SessionService } from './../../session/services/session.service';
import { Injectable } from '@angular/core';
import {environment } from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export class BadgeItem {
  constructor(
  public type: string,
  public value: string) {}
}

export class ChildrenItems {
  constructor(
    public state: string,
    public name: string,
    public type?: string ) {}
}

export class Menu {
  constructor(
  public state: string,
  public name: string,
  public type: string,
  public icon: string,
  public badge?: BadgeItem[],
  public children?: ChildrenItems[],
  public roles?: Number[]) {}
}

const MENUITEMS = [
  {
    state: 'main',
    name: 'Home',
    type: 'link',
    icon: 'home',
    roles: [0, 1, 2, 3, 4 ]
  },
  {
    state: 'employee',
    name: 'Employee',
    type: 'sub',
    icon: 'people',
    children: [
      {state: 'manage', name: 'Manage'},
      {state: 'download', name: 'Downloads'},
      {state: 'reports', name: 'Reports'},
      {state: 'upload', name: 'Uploads'},
    ],
    roles: [0, 1, 2, 3, 4 ]
  },
  {
    state: 'admin',
    name: 'Administrator',
    type: 'sub',
    icon: 'settings',
    children: [
      {state: 'permissions', name: 'Users & Permissions'},
      {state: 'content', name: 'Content'},
      {state: 'employee', name: 'Employee'},
    ],
    roles: [ 3, 4 ]
  },
];

@Injectable()
export class MenuItems {
  Uri = environment.siteUri;
  constructor(private sessionService: SessionService, private http: HttpClient) {

  }
  getActiveMenus() {
    if (this.sessionService.isLoggedIn()) {
      const token = localStorage.getItem('token')
        ? '?token=' + localStorage.getItem('token')
        : '';
      return this.http.get<Array<Menu>>(this.Uri + '/menu' + token);
    }
  }

  add() {
    this.addMenu('').subscribe((response) => console.log(response));
  }
  addMenu(param: any) {
    const body = param ;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.Uri + '/menu', body, { headers: headers });
  }
}
