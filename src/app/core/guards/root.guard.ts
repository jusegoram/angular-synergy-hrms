import { SessionService } from '@synergy-app/core/services';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RootGuard implements CanLoad, CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {
  }

  canLoad(): boolean {
    if (this.checkLogin()) {
      return true;
    } else {
      this.router.navigate(['/auth/signin']);
    }
  }

  canActivate(): boolean {
    if (this.checkLogin()) {
      return true;
    } else {
      this.router.navigate(['/auth/signin']);
    }
  }
  checkLogin(): any {
    return this.sessionService.isLoggedIn();
  }
}
