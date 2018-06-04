import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SessionGuard } from './session/guards/session.guard';

export const AppRoutes: Routes = [
  { path: '',
    redirectTo: '/signin',
    pathMatch: 'full'
  }, {
  path: '',
  component: AdminLayoutComponent,
  children: [{
    path: 'main',
    canActivate: [SessionGuard],
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    canLoad: [SessionGuard]
  },
  {
    path: 'employee',
    canActivate: [SessionGuard],
    loadChildren: './employee/employee.module#EmployeeModule',
    canLoad: [SessionGuard]
  },
  {
    path: 'payroll',
    canActivate: [SessionGuard],
    loadChildren: './payroll/payroll.module#PayrollModule',
    canLoad: [SessionGuard]
  },
  {
    path: 'admin',
    canActivate: [SessionGuard],
    loadChildren: './administration/admin.module#AdminModule',
    canLoad: [SessionGuard]
  }]
}, {
  path: '',
  component: AuthLayoutComponent,
  children: [{
    path: '',
    loadChildren: './session/session.module#SessionModule'
  }]
}, {
  path: '**',
  redirectTo: '404'
}];
