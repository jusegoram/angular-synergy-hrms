import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailResolver } from './detail/detail.resolver';
import { DetailComponent } from './detail/detail.component';
import { UploadComponent } from './upload/upload.component';
import { ManageComponent } from './manage/manage.component';
import { ReportComponent } from './report/report.component';
import { NewComponent } from './new/new.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'detail',
        component: DetailComponent,
        resolve: { employee: DetailResolver },
      },
      { path: 'new', component: NewComponent },
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
export class EmployeeRoutingModule {}
