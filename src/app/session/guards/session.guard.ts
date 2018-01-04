import { SessionService } from '../services/session.service';
import { Injectable } from '@angular/core';
import { CanActivateChild, CanLoad, CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SessionGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(private sessionService: SessionService, private router: Router) { }
  canActivate(): boolean {
      return this.checkLogin();
  }
  canActivateChild(): boolean {
    return this.checkLogin();
  }
  canLoad(): boolean {
    return this.checkLogin();
  }
  checkLogin(): boolean {
    if (this.sessionService.isLoggedIn()) { return true;
    }else {
      window.alert('You dont have permission to view this page, either sign in or ask your manager to give you access');
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
