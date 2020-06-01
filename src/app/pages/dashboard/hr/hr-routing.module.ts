import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trackers',
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports-page/reports-page.module').then((m) => m.ReportsPageModule)
  },
  {
    path: 'trackers',
    loadChildren: () => import('./trackers-page/trackers-page.module').then((m) => m.TrackersModule),
  },
  {
    path: 'leaves',
    loadChildren: () => import('./leaves-page/leaves-page.module').then((m) => m.LeavesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrRoutingModule {}
