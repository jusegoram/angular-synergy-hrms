import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard-page/dashboard-page.module').then((m) => m.DashboardPageModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('./report-page/report-page.module').then((m) => m.ReportPageModule),
      },
      {
        path: 'upload',
        loadChildren: () => import('./upload-page/upload-page.module').then((m) => m.UploadPageModule),
      },
      {
        path: 'manage',
        loadChildren: () => import('./manage-page/manage-page.module').then((m) => m.ManagePageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationsRoutingModule {}
