import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { SharedModule } from '@synergy-app/shared/shared.module';
import { PayedPayrollsComponent } from './containers/payed-payrolls/payed-payrolls.component';
import { NonFinalizedPayrollsComponent } from './containers/non-finalized-payrolls/non-finalized-payrolls.component';
import { FinalizedPayrollsTableComponent } from './components/finalized-payrolls-table/finalized-payrolls-table.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as ExcelExport from 'fusioncharts/fusioncharts.excelexport';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { MinuteSecondsPipe } from '@synergy-app/shared/pipes';
import { NonFinalizedPayrollsTableComponent } from './components/non-finalized-payrolls-table/non-finalized-payrolls-table.component';

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme, ExcelExport);

@NgModule({
  declarations: [
    MainPageComponent,
    FinalizedPayrollsTableComponent,
    NonFinalizedPayrollsComponent,
    PayedPayrollsComponent,
    NonFinalizedPayrollsTableComponent,
  ],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    MaterialSharedModule,
    SharedModule,
    FormsModule,
    NgxDatatableModule,
    FusionChartsModule,
  ],
  providers: [PayrollService, DatePipe, CurrencyPipe, MinuteSecondsPipe],
})
export class MainPageModule {}
