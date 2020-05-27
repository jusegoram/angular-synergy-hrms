import { PayrollService } from '../services/payroll.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class DetailResolver implements Resolve<any> {
  constructor(private _payrollService: PayrollService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._payrollService.getPayroll(route.queryParams.id, '', false);
  }
}
