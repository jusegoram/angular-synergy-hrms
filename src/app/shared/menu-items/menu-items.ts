import {SessionService} from '../../session/session.service';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

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
  public state: any,
  public name: string,
  public type: string,
  public icon: string,
  public badge?: BadgeItem[],
  public children?: ChildrenItems[],
  public page?: number,
  public _id?: string,
  public position?: number) {}
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
      return this.http.get<Array<Menu>>('/api/v1/admin/menu');
  }
// TODO: fix Add method to add new menu items
  add(param: Menu) {
    let res;
    this.addMenu(param).subscribe((response) => {});
    return res;
  }
  delete(param: Menu) {
    let res;
    this.deleteMenu(param).subscribe((response) => res = response);
    return res;
  }

// TODO: Add save method to update menu items
  save(param: Menu) {
    let res;
    this.saveMenu(param).subscribe((response) => res = response );
    return res;
  }
  addMenu(param: Menu) {
    const body = param ;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post('/api/v1/admin/menu', body, { headers: headers });
  }
  saveMenu(param: Menu) {
    const body = JSON.stringify(param);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('name', param.name);
    return this.http.put('/api/v1/admin/menu', body, { headers: headers, params: params });
  }
  deleteMenu(param: Menu) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('name', param.name);
    return this.http.delete('/api/v1/admin/menu', { headers: headers, params: params });
  }
}
