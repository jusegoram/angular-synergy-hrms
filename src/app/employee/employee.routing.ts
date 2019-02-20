import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { DetailResolver} from './detail/detail.resolver';
import { DetailComponent } from './detail/detail.component';
import { DownloadComponent } from './download/download.component';
import { UploadComponent } from './upload/upload.component';
import { ManageComponent } from './manage/manage.component';
import { ReportComponent } from './report/report.component';
import {NewComponent} from './new/new.component';
import { CommonModule } from '@angular/common';
export const routes: Routes = [
  {
    path: '',
      children : [
         { path : 'detail', component : DetailComponent, resolve: { employee: DetailResolver } },
         { path : 'new', component : NewComponent },
         { path : 'download', component : DownloadComponent },
         { path : 'reports', component : ReportComponent },
         { path : 'upload', component : UploadComponent },
         { path : 'manage',   component: ManageComponent}
        ]
  }
];

@NgModule({
imports: [
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class EmployeeRoutingModule {}
