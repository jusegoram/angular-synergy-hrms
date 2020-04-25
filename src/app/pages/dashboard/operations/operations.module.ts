import { AttendanceHistoryComponent } from './report/attendance/attendance-history/attendance-history.component';
import { HoursComponent } from './report/hours/hours.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { OperationsRoutingModule } from './operations.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageComponent } from './manage/manage.component';
import { ReportComponent } from './report/report.component';
import { OperationsService } from './operations.service';
import { MaterialSharedModule } from '../../../shared/material.shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from './detail/detail.component';
import { KpiComponent } from './report/kpi/kpi.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkColumnDef } from '@angular/cdk/table';
import { MatrixComponent } from './report/matrix/matrix.component';
import { TimesheetComponent } from './report/timesheet/timesheet.component';
import { AttendanceComponent } from './report/attendance/attendance.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PipeModule } from '@synergy-app/shared/pipes/pipe/pipe.module';
import { ExportAsModule } from 'ngx-export-as';
import { UploadComponent } from '@synergy-app/pages/dashboard/operations/upload/upload.component';
import { ModalsModule } from '@synergy-app/shared/modals/modals.module';
import { UploadService } from '@synergy-app/pages/dashboard/operations/upload/upload.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '@synergy-app/shared/interceptors/token.interceptor';
import { AuthenticationInterceptor } from '@synergy-app/shared/interceptors/authentication.interceptor';
import { SharedModule } from '@synergy-app/shared/shared.module';
// Import angular-fusioncharts
// import { FusionChartsModule } from 'angular-fusioncharts';

// Pass the fusioncharts library and chart modules
// FusionChartsModule.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);
export function provideSwal() {
  return import('sweetalert2/src/sweetalert2.js'); // instead of import('sweetalert2')
}

@NgModule({
  imports: [
    CommonModule,
    OperationsRoutingModule,
    MaterialSharedModule,
    NgxDatatableModule,
    FileUploadModule,
    FormsModule,
    // FusionChartsModule,
    ScrollingModule,
    SweetAlert2Module.forRoot({ provideSwal }),
    PipeModule.forRoot(),
    ExportAsModule,
    ModalsModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    UploadComponent,
    ManageComponent,
    ReportComponent,
    DetailComponent,
    KpiComponent,
    TimesheetComponent,
    AttendanceComponent,
    AttendanceHistoryComponent,
    MatrixComponent,
    HoursComponent,
  ],
  providers: [
    UploadService,
    OperationsService,
    TitleCasePipe,
    DatePipe,
    CdkColumnDef,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
  ],
})
export class OperationsModule {}
