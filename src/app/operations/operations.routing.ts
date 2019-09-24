import { AttendanceComponent } from './attendance/attendance.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CloudUploadComponent } from './cloud-upload/cloud-upload.component';
import { ReportComponent } from './report/report.component';
import { ManageComponent } from './manage/manage.component';
import { DetailComponent } from '../employee/detail/detail.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
const routes: Routes = [
  {
    path: '',
      children : [
         { path : 'dashboard', component : DashboardComponent },
         //{ path: 'detail', component: DetailComponent},
         { path : 'reports', component : ReportComponent },
         { path : 'upload', component : CloudUploadComponent},
         { path : 'manage',   component: ManageComponent},
         { path : 'attendance',   component: AttendanceComponent},
         { path : 'timesheet',   component: TimesheetComponent}

        ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule {

}
