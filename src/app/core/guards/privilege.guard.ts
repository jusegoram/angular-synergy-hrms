import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '@synergy-app/core/services';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private _session: SessionService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const allowedRoles = next.data.allowedRoles;
    const isAuthorized = this._session.isAuthorized(allowedRoles);
    if (!isAuthorized) {
      this.router.navigate(['auth', '404']);
    }
    return isAuthorized;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const allowedRoles = next.data.allowedRoles;
    const isAuthorized = this._session.isAuthorized(allowedRoles);
    if (!isAuthorized) {
      this.router.navigate(['auth', '404']);
    }
    return isAuthorized;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
