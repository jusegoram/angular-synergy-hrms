import {TimeOffComponent} from './time-off/time-off.component';
import {TrackersComponent} from './trackers/trackers.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
      children : [
        { path: 'timeOff', component:  TimeOffComponent},
        { path: 'trackers', component: TrackersComponent}
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
