import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'employee',
        loadChildren: () => import('./employee-page/employee-page.module').then((m) => m.EmployeePageModule),
      },
      {
        path: 'payroll',
        loadChildren: () => import('./payroll-page/payroll-page.module').then((m) => m.PayrollPageModule),
      },
      {
        path: 'permissions',
        loadChildren: () => import('./account-page/account-page.module').then((m) => m.AccountPageModule),
      },
      {
        path: 'content',
        loadChildren: () => import('./content-page/content-page.module').then((m) => m.ContentPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
