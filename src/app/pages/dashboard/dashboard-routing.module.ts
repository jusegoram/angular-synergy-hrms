import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '@synergy-app/core/layouts/';
import { PrivilegeGuard, SessionGuard } from '@synergy-app/core/guards/';
import { USER_ROLES } from '@synergy/environments/enviroment.common';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivateChild: [SessionGuard],
    canLoad: [SessionGuard],
    children: [
      {
        path: '',
        redirectTo: 'main',
      },
      {
        path: 'main',
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'employee',
        loadChildren: () => import('./employee/employee.module').then((m) => m.EmployeeModule),
      },
      {
        path: 'operations',
        loadChildren: () => import('./operations/operations.module').then((m) => m.OperationsModule),
      },
      {
        path: 'payroll',
        loadChildren: () => import('./payroll/payroll.module').then((m) => m.PayrollModule),
      },
      {
        path: 'hr',
        loadChildren: () => import('./hr/hr.module').then((m) => m.HrModule),
      },
      {
        path: 'admin',
        data: {
          allowedRoles: [USER_ROLES.WEB_ADMINISTRATOR.value],
        },
        canActivateChild: [PrivilegeGuard],
        canLoad: [PrivilegeGuard],
        loadChildren: () => import('./administration/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
