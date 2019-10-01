import { PayrollService } from './../../services/payroll.service';
import { Payroll } from './../manage/Payroll';

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class DetailResolver implements Resolve<Payroll> {

  constructor(private _payrollService: PayrollService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Payroll> {
    return this._payrollService.getPayroll(route.queryParams.id, '');
  }

}
