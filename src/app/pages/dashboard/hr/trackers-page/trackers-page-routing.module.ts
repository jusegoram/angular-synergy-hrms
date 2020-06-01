import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackersPageComponent } from './trackers-page.component';

const routes: Routes = [
  {
    path: '',
    component: TrackersPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackersRoutingModule {}
