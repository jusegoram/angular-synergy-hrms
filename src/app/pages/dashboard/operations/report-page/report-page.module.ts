import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { ReportPageRoutingModule } from './report-page-routing.module';
import { ReportPageComponent } from './report-page.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { KpiComponent } from './kpi/kpi.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AttendanceHistoryComponent } from './attendance/attendance-history/attendance-history.component';
import { MatrixComponent } from './matrix/matrix.component';
import { HoursComponent } from './hours/hours.component';
import { SharedModule } from '@synergy-app/shared';
import { CdkColumnDef } from '@angular/cdk/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ReportPageComponent,
    KpiComponent,
    TimesheetComponent,
    AttendanceComponent,
    AttendanceHistoryComponent,
    MatrixComponent,
    HoursComponent,
  ],
  imports: [
    CommonModule,
    ReportPageRoutingModule,
    MaterialSharedModule,
    SharedModule,
    NgxDatatableModule,
    FileUploadModule,
    FormsModule,
  ],
  providers: [TitleCasePipe, DatePipe, CdkColumnDef],
})
export class ReportPageModule {}
