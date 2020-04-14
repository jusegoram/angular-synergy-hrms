import { SessionService } from '../../session/session.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { USER_ROLES } from '../../../environments/enviroment.common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export class BadgeItem {
  constructor(public type: string, public value: string) {
  }
}

export class ChildrenItems {
  constructor(public state: string, public name: string, public type?: string) {}
}

export class Menu {
  constructor(
    public state: any,
    public name: string,
    public type: string,
    public icon: string,
    public badge?: BadgeItem[],
    public children?: ChildrenItems[],
    public page?: number,
    public _id?: string,
    public position?: number
  ) {}
}

const MENUITEMS = [
  {
    state: 'main',
    name: 'Home',
    type: 'link',
    icon: 'home',
    roles: [
      USER_ROLES.ACCOUNTING.value,
      USER_ROLES.MANAGEMENT.value,
      USER_ROLES.TRAINING.value,
      USER_ROLES.ADMINISTRATOR.value,
      USER_ROLES.UNKNOWN.value,
    ],
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
    roles: [
      USER_ROLES.ACCOUNTING.value,
      USER_ROLES.MANAGEMENT.value,
      USER_ROLES.TRAINING.value,
      USER_ROLES.ADMINISTRATOR.value,
      USER_ROLES.UNKNOWN.value,
    ],
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
    roles: [USER_ROLES.ADMINISTRATOR.value, USER_ROLES.UNKNOWN.value],
  },
];

@Injectable()
export class MenuItems {
  api = environment.apiUrl;
  constructor(private sessionService: SessionService, private http: HttpClient) {}
  getActiveMenus() {
    return this.http.get<Array<Menu>>(this.api + '/admin/menu');
  }

  // TODO: fix Add method to add new menu items
  add(param: Menu) {
    let res;
    this.addMenu(param).subscribe((response) => {
      res = response;
    });
    return res;
  }

  delete(param: Menu) {
    return this.deleteMenu(param);
  }

  // TODO: Add save method to update menu items
  save(param: Menu) {
    return this.saveMenu(param);
  }

  addMenu(param: Menu) {
    const body = param;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.api + '/admin/menu', body, {headers: headers});
  }

  saveMenu(param: Menu) {
    const body = JSON.stringify(param);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams().set('name', param.name);
    return this.http.put(this.api + '/admin/menu', body, {
      headers: headers,
      params: params,
    });
  }

  deleteMenu(param: Menu) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams().set('name', param.name);
    return this.http.delete(this.api + '/admin/menu', {
      headers: headers,
      params: params,
    });
  }
}
