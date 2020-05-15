import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { USER_ROLES } from '@synergy/environments/enviroment.common';
import { PrivilegeGuard } from '@synergy-app/core/guards/privilege.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'detail',
        loadChildren: () => import('./detail-page/detail-page.module').then((m) => m.DetailPageModule),
      },
      {
        path: 'leaves',
        loadChildren: () => import('./leaves-page/leaves-page.module').then((m) => m.LeavesModule),
      },
      {
        path: 'new',
        loadChildren: () => import('./new-employee-page/new-employee-page.module').then(
          (m) => m.NewEmployeePageModule
        ),
      },
      {
        path: 'reports',
        loadChildren: () => import('./report-page/report-page.module').then((m) => m.ReportPageModule),
      },
      {
        path: 'upload',
        data: {
          allowedRoles: [USER_ROLES.WEB_ADMINISTRATOR.value],
        },
        canActivate: [PrivilegeGuard],
        loadChildren: () => import('./upload-page/upload-page.module').then((m) => m.UploadPageModule),
      },
      {
        path: 'manage',
        loadChildren: () => import('./manage-employees-page/manage-employees-page.module').then(
          (m) => m.ManageEmployeesPageModule
        )
      },
      {
        path: 'superiors',
        loadChildren: () => import('./superiors-page/superiors-page.module').then((m) => m.SuperiorsPageModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
