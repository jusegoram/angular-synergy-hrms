import {SessionService} from '../session.service';
import {Injectable} from '@angular/core';
import {ActivatedRoute, CanActivate, CanActivateChild, CanLoad, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {GuardDialogComponent} from './guard-dialog/guard-dialog.component';

@Injectable()
export class SessionGuard implements CanActivate, CanLoad, CanActivateChild {
  returnUrl: string;
  constructor(private sessionService: SessionService, private router: Router, private dialog: MatDialog, private route: ActivatedRoute) {
   }
  // TODO: Re-evaluate current guards and checks to be able to reanbled routeguards.
  canActivate(): boolean {
    if (this.checkLogin()) {
      return true;
    } else {
      return this.openDialog();
    }
  }
  canActivateChild(): boolean {
    if (this.checkLogin()) {
      return true;
    } else {
     return this.openDialog();
    }
  }
  canLoad(): boolean {
    if (this.checkLogin()) {
      return true;
    } else {
      this.router.navigateByUrl('/signin');
    }
  }
  checkLogin(): any {
    return this.sessionService.isLoggedIn();
  }
  openDialog(): boolean {
    const dialogConfig = new MatDialogConfig();
    let answer: boolean;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

   const dialogRef =  this.dialog.open(GuardDialogComponent, dialogConfig);

   dialogRef.afterClosed().subscribe(
    data => {
        if (!data) {
          answer = false;
          this.router.navigateByUrl('/signin');
        } else {
          answer = true;
        }
    });
    return answer;
}
}
