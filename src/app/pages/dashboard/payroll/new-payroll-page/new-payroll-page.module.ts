import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { NewPayrollPageRoutingModule } from './new-payroll-page-routing.module';
import { NewPayrollPageComponent } from './new-payroll-page.component';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FusionChartsModule } from 'angular-fusioncharts';
import { PayrollService } from '@synergy-app/core/services/payroll.service';


@NgModule({
  declarations: [NewPayrollPageComponent],
  imports: [
    CommonModule,
    NewPayrollPageRoutingModule,
    MaterialSharedModule,
    NgxDatatableModule,
    FusionChartsModule,
    SharedModule,
  ],
  providers: [PayrollService, DatePipe, CurrencyPipe]
})
export class NewPayrollPageModule { }
