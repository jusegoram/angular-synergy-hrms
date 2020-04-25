import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailResolver } from './detail/detail.resolver';
import { DetailComponent } from './detail/detail.component';
import { UploadComponent } from './upload/upload.component';
import { ManageComponent } from './manage/manage.component';
import { ReportComponent } from './report/report.component';
import { NewComponent } from './new/new.component';
import { SuperiorsComponent } from './superiors/superiors.component';
import { USER_ROLES } from '@synergy/environments/enviroment.common';
import { PrivilegeGuard } from '@synergy-app/pages/session/guards/privilege.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'detail',
        component: DetailComponent,
        resolve: {employee: DetailResolver},
      },
      {
        path: 'leaves',
        loadChildren: () => import('./leaves/leaves.module').then((m) => m.LeavesModule),
      },
      {path: 'new', component: NewComponent},
      {path: 'reports', component: ReportComponent},
      {
        path: 'upload',
        data: {
          allowedRoles: [USER_ROLES.WEB_ADMINISTRATOR.value],
        },
        canActivate: [PrivilegeGuard],
        component: UploadComponent},
      {path: 'manage', component: ManageComponent},
      {path: 'superiors', component: SuperiorsComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
