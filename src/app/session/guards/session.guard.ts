import { SessionService } from '../services/session.service';
import { Injectable } from '@angular/core';
import { CanActivateChild, CanLoad, CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SessionGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(private sessionService: SessionService, private router: Router) { }
  // TODO: Re-evaluate current guards and checks to be able to reanbled routeguards.
  canActivate(): boolean {
      if (this.checkLogin()) {
        return true;
      } else {
        window.alert('You are not logged in, please log in and try again');
        this.router.navigateByUrl('/signin');
        return false;
      }
  }
  canActivateChild(): boolean {
    if (this.checkLogin()) {
      return true;
    } else {
      window.alert('You are not logged in, please log in and try again');
      this.router.navigateByUrl('/signin');
      return false;
    }
  }
  canLoad(): boolean {
    if (this.checkLogin()) {
      return true;
    } else {
      window.alert('You are not logged in, please log in and try again');
      this.router.navigateByUrl('/signin');
      return false;
    }
  }
  checkLogin(): any {
    return this.sessionService.isLoggedIn();
  }
}
