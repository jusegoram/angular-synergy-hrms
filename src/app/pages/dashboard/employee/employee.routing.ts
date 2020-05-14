import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailResolver } from './detail-page/detail-page.resolver';
import { DetailPageComponent } from './detail-page/detail-page.component';
import { UploadPageComponent } from './upload-page/upload.component';
import { ManageEmployeesComponent } from './manage-employees-page/manage-employees-page.component';
import { ReportPageComponent } from './report-page/report-page.component';
import { NewEmployeePageComponent } from './new-employee-page/new-employee-page.component';
import { SuperiorsPageComponent } from './superiors-page/superiors-page.component';
import { USER_ROLES } from '@synergy/environments/enviroment.common';
import { PrivilegeGuard } from '@synergy-app/core/guards/privilege.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'detail',
        component: DetailPageComponent,
        resolve: {employee: DetailResolver},
      },
      {
        path: 'leaves',
        loadChildren: () => import('./leaves-page/leaves-page.module').then((m) => m.LeavesModule),
      },
      {path: 'new', component: NewEmployeePageComponent},
      {path: 'reports', component: ReportPageComponent},
      {
        path: 'upload',
        data: {
          allowedRoles: [USER_ROLES.WEB_ADMINISTRATOR.value],
        },
        canActivate: [PrivilegeGuard],
        component: UploadPageComponent},
      {path: 'manage', component: ManageEmployeesComponent},
      {path: 'superiors', component: SuperiorsPageComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
