import { SessionService } from '@synergy-app/core/services';
import { Injectable } from '@angular/core';
import { environment } from '@synergy/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MenuItem } from '@synergy-app/shared/models';


// NOTE: THIS ITEM IS ONLY FOR REFERENCE, MENU ITEMS ARE STORED IN THE DATABASE
// const MENUITEMS = [
//   {
//     state: 'home',
//     name: 'Home',
//     type: 'link',
//     icon: 'home',
//     roles: [
//       USER_ROLES.ACCOUNTING.value,
//       USER_ROLES.MANAGEMENT.value,
//       USER_ROLES.TRAINING.value,
//       USER_ROLES.ADMINISTRATOR.value,
//       USER_ROLES.OPERATIONS.value,
//     ],
//   },
//   {
//     state: 'employee',
//     name: 'Employee',
//     type: 'sub',
//     icon: 'people',
//     children: [
//       {state: 'manage', name: 'Manage'},
//       {state: 'download', name: 'Downloads'},
//       {state: 'reports', name: 'Reports'},
//       {state: 'upload', name: 'Uploads'},
//     ],
//     roles: [
//       USER_ROLES.ACCOUNTING.value,
//       USER_ROLES.MANAGEMENT.value,
//       USER_ROLES.TRAINING.value,
//       USER_ROLES.ADMINISTRATOR.value,
//       USER_ROLES.OPERATIONS.value,
//     ],
//   },
//   {
//     state: 'admin',
//     name: 'Administrator',
//     type: 'sub',
//     icon: 'settings',
//     children: [
//       {state: 'permissions', name: 'Users & Permissions'},
//       {state: 'content', name: 'Content'},
//       {state: 'employee', name: 'Employee'},
//     ],
//     roles: [USER_ROLES.ADMINISTRATOR.value, USER_ROLES.OPERATIONS.value],
//   },
// ];


@Injectable()
export class MenuService {
  api = environment.apiUrl;
  constructor(private sessionService: SessionService, private http: HttpClient) {}
  getActiveMenus() {
    return this.http.get<Array<MenuItem>>(this.api + '/admin/menu');
  }

  // TODO: fix Add method to add new menu items
  add(param: MenuItem) {
    let res = {};
    this.addMenu(param).subscribe((response) => {
      res = response;
    });
    return res;
  }

  delete(param: MenuItem) {
    return this.deleteMenu(param);
  }

  // TODO: Add save method to update menu items
  save(param: MenuItem) {
    return this.saveMenu(param);
  }

  addMenu(param: MenuItem) {
    const body = param;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.api + '/admin/menu', body, {headers: headers});
  }

  saveMenu(param: MenuItem) {
    const body = JSON.stringify(param);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams().set('name', param.name);
    return this.http.put(this.api + '/admin/menu', body, {
      headers: headers,
      params: params,
    });
  }

  deleteMenu(param: MenuItem) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams().set('name', param.name);
    return this.http.delete(this.api + '/admin/menu', {
      headers: headers,
      params: params,
    });
  }
}
