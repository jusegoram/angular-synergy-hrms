import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { ReportPageRoutingModule } from './report-page-routing.module';
import { ReportPageComponent } from './report-page.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { KpiComponent } from './containers/kpi/kpi.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { AttendanceComponent } from './containers/attendance/attendance.component';
import { AttendanceHistoryComponent } from './components/attendance-history/attendance-history.component';
import { MatrixComponent } from './containers/matrix/matrix.component';
import { HoursComponent } from './containers/hours/hours.component';
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
