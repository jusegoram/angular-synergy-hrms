import {Routes} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';
import {SessionGuard} from './session/guards/session.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'main',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canLoad: [SessionGuard]
      },
      {
        path: 'employee',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
        canLoad: [SessionGuard]
      },
      {
        path: 'training',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: () => import('./training/training.module').then(m => m.TrainingModule),
        canLoad: [SessionGuard]
      },
      {
        path: 'operations',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: () => import('./operations/operations.module').then(m => m.OperationsModule),
        canLoad: [SessionGuard]
      },
      {
        path: 'payroll',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: () => import('./payroll/payroll.module').then(m => m.PayrollModule),
        canLoad: [SessionGuard]
      },
      {
        path: 'hr',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: () => import('./hr/hr.module').then(m => m.HrModule),
        canLoad: [SessionGuard]
      },
      {
        path: 'admin',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: () => import('./administration/admin.module').then(m => m.AdminModule),
        canLoad: [SessionGuard]
      },
      {
        path: 'user',
        canActivate: [SessionGuard],
        canActivateChild: [SessionGuard],
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        canLoad: [SessionGuard]
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./session/session.module').then(m => m.SessionModule)
    }]
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
