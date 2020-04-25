import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from '@synergy-app/pages/dashboard/operations/upload/upload.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reports', component: ReportComponent },
      { path: 'upload', component: UploadComponent },
      { path: 'manage', component: ManageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationsRoutingModule {}
