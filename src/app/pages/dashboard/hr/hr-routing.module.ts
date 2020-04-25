import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trackers',
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
