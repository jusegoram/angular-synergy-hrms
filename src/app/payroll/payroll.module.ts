import { PipeModule } from './../shared/pipes/pipe/pipe.module';
import { MinuteSecondsPipe } from './../shared/pipes/minute-seconds.pipe';
import { DetailResolver } from './components/detail/detail.resolver';
import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';
import { UploadComponent } from './components/upload/upload.component';
import { ExportComponent } from './components/export/export.component';
import { PayslipsComponent } from './components/payslips/payslips.component';
import {MaterialSharedModule} from '../shared/material.shared.module';
import {FileUploadModule} from 'ng2-file-upload';
import {FormsModule} from '@angular/forms';
import {PayrollService} from './services/payroll.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { TokenInterceptor } from '../token-interceptor.service';
import { AuthenticationService } from '../authentication.service';
import { CdkColumnDef } from '@angular/cdk/table';
import { ExportBottomSheetComponent } from './components/manage/export-bottom-sheet/export-bottom-sheet.component';
import { ManageComponent } from './components/manage/manage.component';
import { MainComponent } from './components/main/main.component';
import { DetailComponent } from './components/detail/detail.component';
import { PayDialogComponent } from './components/main/pay/pay.component';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as ExcelExport from 'fusioncharts/fusioncharts.excelexport'
import * as Charts from 'fusioncharts/fusioncharts.charts';
// import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
// import * as TimeSeries from 'fusioncharts/fusioncharts.timeseries';
import { ExportAsModule } from 'ngx-export-as';
import { ConceptsComponent } from './components/concepts/concepts.component';


FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme, ExcelExport)


@NgModule({
  imports: [
    CommonModule,
    PayrollRoutingModule,
    MaterialSharedModule,
    HttpClientModule,
    FileUploadModule,
    FormsModule,
    NgxDatatableModule,
    FusionChartsModule,
    ExportAsModule,
    PipeModule.forRoot()
  ],
  declarations: [
    ManageComponent,
    UploadComponent,
    ExportComponent,
    PayslipsComponent,
    ExportBottomSheetComponent,
    MainComponent,
    DetailComponent,
    PayDialogComponent,
    ConceptsComponent],
  providers: [ PayrollService, DetailResolver, TitleCasePipe, MinuteSecondsPipe, CdkColumnDef,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationService,
      multi: true
    }],
    entryComponents: [
      ExportBottomSheetComponent,
      PayDialogComponent
    ]
})
export class PayrollModule { }
