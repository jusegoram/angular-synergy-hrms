import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'main',
      loadChildren: () => import('./main-page/main-page.module').then((m) => m.MainPageModule)},
      {path: 'concepts',
      loadChildren: () => import('./concepts-page/concepts-page.module').then((m) => m.ConceptsPageModule)},
      {
        path: 'detail',
        loadChildren: () => import('./detail-page/detail-page.module').then((m) => m.DetailPageModule)
      },
      {path: 'new',
      loadChildren: () => import('./new-payroll-page/new-payroll-page.module').then((m) => m.NewPayrollPageModule)},
      {path: 'payslip',
      loadChildren: () => import('./payslips-page/payslips-page.module').then((m) => m.PayslipsPageModule)},
      {path: 'upload',
        loadChildren: () => import('./upload-page/upload-page.module').then((m) => m.UploadPageModule)},
      {path: 'reports',
        loadChildren: () => import('./report-page/report-page.module').then((m) => m.ReportPageModule)},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
