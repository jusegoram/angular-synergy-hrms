import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SessionGuard } from './session/guards/session.guard';
import { AppComponent } from './app.component';
import { RootGuard } from './session/guards/root.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: '/signin',
    pathMatch: 'full'
  },
  // {
  //   path: '', component: AppComponent, canActivate: [RootGuard], canLoad: [RootGuard]
  // },
  {
  path: '',
  component: AdminLayoutComponent,
      children: [
        {
        path: 'main',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        canLoad: [SessionGuard]
      },
      {
        path: 'employee',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: './employee/employee.module#EmployeeModule',
        canLoad: [SessionGuard]
      },
      {
        path: 'training',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: './training/training.module#TrainingModule',
        canLoad: [SessionGuard]
      },
      {
        path: 'operations',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: './operations/operations.module#OperationsModule',
        canLoad: [SessionGuard]
      },
      {
        path: 'payroll',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: './payroll/payroll.module#PayrollModule',
        canLoad: [SessionGuard]
      },
      {
        path: 'admin',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: './administration/admin.module#AdminModule',
        canLoad: [SessionGuard]
      },
      {
        path: 'user',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: './user/user.module#UserModule',
        canLoad: [SessionGuard]
      }
    ]
},
{
  path: '',
  component: AuthLayoutComponent,
  children: [{
    path: '',
    loadChildren: './session/session.module#SessionModule'
  }]
},
 {
  path: '**',
  redirectTo: '404'
}
];
