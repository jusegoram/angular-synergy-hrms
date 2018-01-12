import { Subscription } from 'rxjs/Subscription';
import { SessionService } from './../../session/services/session.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response } from '@angular/http';
import {environment } from '../../../environments/environment';

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
  constructor(private sessionService: SessionService, private http: Http) {

  }
  getActiveMenus() {
    if (this.sessionService.isLoggedIn()) {
    const token = localStorage.getItem('token')
        ? '?token=' + localStorage.getItem('token')
        : '';
    return this.http.get(this.Uri + '/menu' + token)
        .map(
        (response: Response) => {
            const menus = response.json().obj;
            let transformedMenus: Menu[] = [];
            for (let menu of menus) {
                transformedMenus.push( new Menu(
                    menu.state,
                    menu.name,
                    menu.type,
                    menu.icon,
                    menu.badge,
                    menu.children,
                    menu.roles
                ));
            }
            return transformedMenus;
        })
        .catch((err: Response) => Observable.throw(err));
    }
}

  add() {
    this.addMenu().subscribe((response) => console.log(response));
  }
  addMenu() {
    const body = JSON.stringify(MENUITEMS[2]);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(this.Uri + '/menu', body, { headers: headers })
        .map((response: Response) => response.json())
        .catch((error: Response) => Observable.throw(error.json()));
  }
}
