import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackersComponent } from './trackers.component';

const routes: Routes = [
  {
    path: '',
    component: TrackersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackersRoutingModule {}
