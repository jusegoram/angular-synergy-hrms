import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrComponent } from './hr.component';
import { TrackersComponent } from './trackers/trackers.component';

const routes: Routes = [
  {
    path: '',
    component: HrComponent,
  },
  { path: 'trackers', component: TrackersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrRoutingModule {}
