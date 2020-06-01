import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe, AsyncPipe } from '@angular/common';
import { DetailPageRoutingModule } from './detail-page-routing.module';
import { DetailPageComponent } from './detail-page.component';
import { FusionChartsModule } from 'angular-fusioncharts';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {
  EditPayrollDetailVacationsComponent
} from './components/edit-payroll-detail-vacations/edit-payroll-detail-vacations.component';
import { DetailResolver } from './resolvers/detail-page.resolver';
import { EditPayrollDetailComponent } from './containers/edit-payroll-detail/edit-payroll-detail.component';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { CdkColumnDef } from '@angular/cdk/table';
import { MinuteSecondsPipe } from '@synergy-app/shared/pipes';
import * as FusionCharts from 'fusioncharts';
import * as ExcelExport from 'fusioncharts/fusioncharts.excelexport';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme, ExcelExport);
@NgModule({
  declarations: [DetailPageComponent, EditPayrollDetailVacationsComponent, EditPayrollDetailComponent],
  imports: [
    CommonModule,
    DetailPageRoutingModule,
    FusionChartsModule,
    MaterialSharedModule,
    NgxDatatableModule,
    SharedModule,
  ],
  providers: [DetailResolver, PayrollService, CdkColumnDef, DatePipe, CurrencyPipe, MinuteSecondsPipe, AsyncPipe],
  entryComponents: [EditPayrollDetailComponent],
})
export class DetailPageModule {}
