import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { PayrollPageRoutingModule } from './payroll-page-routing.module';
import { PayrollPageComponent } from './payroll-page.component';
import { SocialSecurityComponent } from './social-security/social-security.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { IncomeTaxComponent } from './income-tax/income-tax.component';

@NgModule({
  declarations: [PayrollPageComponent, SocialSecurityComponent, HolidaysComponent, IncomeTaxComponent],
  imports: [CommonModule, PayrollPageRoutingModule],
  providers: [CurrencyPipe, DatePipe],
})
export class PayrollPageModule {}
