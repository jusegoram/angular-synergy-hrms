import { SessionService } from '../services/session.service';
import { Injectable } from '@angular/core';
import { CanActivateChild, CanLoad, CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SessionGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(private sessionService: SessionService, private router: Router) { }
  // TODO: Re-evaluate current guards and checks to be able to reanbled routeguards.
  canActivate(): boolean {
      return this.checkLogin();
  }
  canActivateChild(): boolean {
    return this.checkLogin();
  }
  canLoad(): boolean {
    return this.checkLogin();
  }
  checkLogin(): any {
    return true;
    // return this.sessionService.isLoggedIn();
  }
}
