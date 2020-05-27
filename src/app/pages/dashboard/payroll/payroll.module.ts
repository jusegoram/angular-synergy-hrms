import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollRoutingModule } from './payroll-routing.module';
import { PayrollService } from './services/payroll.service';

@NgModule({
  imports: [
    CommonModule,
    PayrollRoutingModule,
  ],
  declarations: [],
  providers: [
    PayrollService
  ]
})
export class PayrollModule {}
