import { SessionService } from '../session.service';
import {  Router, CanLoad, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class RootGuard implements CanLoad, CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {}
  canLoad(): boolean {
    if (this.checkLogin()) {
      return true;
    }else {
      this.router.navigate(['/signin']);
    }
  }

  canActivate(): boolean {
    if (this.checkLogin()) {
      return true;
    }else {
      this.router.navigate(['/signin']);
    }
  }
  checkLogin(): any {
    return this.sessionService.isLoggedIn();
  }
}
