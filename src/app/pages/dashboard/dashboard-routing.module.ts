import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AdminLayoutComponent } from '@synergy-app/shared/layouts/admin/admin-layout.component';
import { SessionGuard } from '../session/guards/session.guard';

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
        path: 'training',
        loadChildren: () => import('./training/training.module').then((m) => m.TrainingModule),
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
