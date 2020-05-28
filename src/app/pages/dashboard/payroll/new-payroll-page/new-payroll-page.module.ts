import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { NewPayrollPageRoutingModule } from './new-payroll-page-routing.module';
import { NewPayrollPageComponent } from './new-payroll-page.component';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FusionChartsModule } from 'angular-fusioncharts';
import { ExportBottomSheetComponent } from './components/export-bottom-sheet/export-bottom-sheet.component';
import { PayrollService } from '../services/payroll.service';


@NgModule({
  declarations: [NewPayrollPageComponent, ExportBottomSheetComponent],
  imports: [
    CommonModule,
    NewPayrollPageRoutingModule,
    MaterialSharedModule,
    NgxDatatableModule,
    FusionChartsModule,
    SharedModule,
  ],
  entryComponents: [ExportBottomSheetComponent],
  providers: [PayrollService, DatePipe, CurrencyPipe]
})
export class NewPayrollPageModule { }
