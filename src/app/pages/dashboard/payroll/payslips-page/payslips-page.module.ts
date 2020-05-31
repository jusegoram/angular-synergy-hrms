import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { PayslipsPageRoutingModule } from './payslips-page-routing.module';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { MinuteSecondsPipe } from '@synergy-app/shared/pipes';

@NgModule({
  imports: [
    CommonModule,
    PayslipsPageRoutingModule,
    MaterialSharedModule,
    SharedModule
  ],
  providers: [PayrollService, DatePipe, CurrencyPipe, MinuteSecondsPipe]
})
export class PayslipsPageModule { }
