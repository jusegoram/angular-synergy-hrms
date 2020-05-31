import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class DetailResolver implements Resolve<any> {
  constructor(private payrollService: PayrollService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.payrollService.getPayroll(route.queryParams.id, '', false);
  }
}
