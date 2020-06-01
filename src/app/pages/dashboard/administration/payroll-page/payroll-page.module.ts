import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { PayrollPageRoutingModule } from './payroll-page-routing.module';
import { PayrollPageComponent } from './payroll-page.component';
import { SocialSecurityComponent } from './containers/social-security/social-security.component';
import { HolidaysComponent } from './containers/holidays/holidays.component';
import { IncomeTaxComponent } from './containers/income-tax/income-tax.component';
import { MaterialSharedModule } from '@synergy-app/shared';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [PayrollPageComponent, SocialSecurityComponent, HolidaysComponent, IncomeTaxComponent],
  imports: [CommonModule, PayrollPageRoutingModule, MaterialSharedModule, NgxDatatableModule],
  providers: [CurrencyPipe, DatePipe],
})
export class PayrollPageModule {}
