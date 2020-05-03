import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'trackers',
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'trackers',
    loadChildren: () => import('./trackers/trackers.module').then((m) => m.TrackersModule),
  },
  {
    path: 'leaves',
    loadChildren: () => import('./leaves/leaves.module').then((m) => m.LeavesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrRoutingModule {}
