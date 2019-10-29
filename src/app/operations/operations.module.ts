import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';

import { OperationsRoutingModule } from './operations.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CloudUploadComponent } from './cloud-upload/cloud-upload.component';
import { ManageComponent } from './manage/manage.component';
import { ReportComponent } from './report/report.component';
import { OperationsService } from './operations.service';
import { MaterialSharedModule } from '../shared/material.shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
// Import angular-fusioncharts
//import { FusionChartsModule } from 'angular-fusioncharts';

// Import FusionCharts library and chart modules
//import * as FusionCharts from 'fusioncharts';
//import * as Charts from 'fusioncharts/fusioncharts.charts';
//import * as Widgets from 'fusioncharts/fusioncharts.widgets';
//import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { DetailComponent } from './detail/detail.component';
import { KpiComponent } from './report/kpi/kpi.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkColumnDef } from '@angular/cdk/table';
import { TokenInterceptor } from '../token-interceptor.service';
import { AuthenticationService } from '../authentication.service';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { MatrixComponent } from './timesheet/matrix/matrix.component';

// Pass the fusioncharts library and chart modules
//FusionChartsModule.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);


@NgModule({
  imports: [
    CommonModule,
    OperationsRoutingModule,
    MaterialSharedModule,
    HttpClientModule,
    NgxDatatableModule,
    FileUploadModule,
    FormsModule,
   // FusionChartsModule,
    ScrollingModule,
  ],
  declarations: [DashboardComponent, CloudUploadComponent, ManageComponent, ReportComponent, DetailComponent, KpiComponent, TimesheetComponent, AttendanceComponent, MatrixComponent, ],
  providers: [
    OperationsService, TitleCasePipe, DatePipe, CdkColumnDef,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationService,
      multi: true
    }]
})
export class OperationsModule { }
