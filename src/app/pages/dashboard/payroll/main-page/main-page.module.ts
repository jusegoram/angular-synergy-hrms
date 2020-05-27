import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';
import { MaterialSharedModule } from '@synergy-app/shared';
import { PayedPayrollsComponent } from './payed-payrolls/payed-payrolls.component';
import { NonFinalizedPayrollsComponent } from './non-finalized-payrolls/non-finalized-payrolls.component';
import { FinalizedPayrollsComponent } from './finalized-payrolls/finalized-payrolls.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as ExcelExport from 'fusioncharts/fusioncharts.excelexport';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { PayrollService } from '../services/payroll.service';
import { MinuteSecondsPipe } from '@synergy-app/shared/pipes';

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme, ExcelExport);

@NgModule({
  declarations: [MainPageComponent, FinalizedPayrollsComponent, NonFinalizedPayrollsComponent, PayedPayrollsComponent],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    MaterialSharedModule,
    FormsModule,
    NgxDatatableModule,
    FusionChartsModule,
  ],
  providers: [PayrollService, DatePipe, CurrencyPipe, MinuteSecondsPipe],
})
export class MainPageModule {}
