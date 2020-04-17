import { AttendanceHistoryComponent } from './report/attendance/attendance-history/attendance-history.component';
import { HoursComponent } from './report/hours/hours.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { OperationsRoutingModule } from './operations.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CloudUploadComponent } from './cloud-upload/cloud-upload.component';
import { ManageComponent } from './manage/manage.component';
import { ReportComponent } from './report/report.component';
import { OperationsService } from './operations.service';
import { MaterialSharedModule } from '../../../shared/material.shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
  ],
  declarations: [
    DashboardComponent,
    CloudUploadComponent,
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
    OperationsService,
    TitleCasePipe,
    DatePipe,
    CdkColumnDef
  ],
})
export class OperationsModule {}
