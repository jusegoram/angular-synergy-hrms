import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeavesPageComponent } from './leaves-page.component';

const routes: Routes = [
  {
    path: '',
    component: LeavesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeavesRoutingModule {}
