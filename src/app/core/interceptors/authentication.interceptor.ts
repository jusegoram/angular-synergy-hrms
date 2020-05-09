import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SessionService } from '@synergy-app/core/services';
import { HTTP_CODES } from '@synergy/environments/enviroment.common';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private router: Router, private _session: SessionService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === HTTP_CODES.UNAUTHORIZED) {
              // redirect to the login route
              // or show a modal
              this._session.logout();
              this.router.navigate(['auth', 'signin']);
            }
          }
        }
      )
    );
  }
}
