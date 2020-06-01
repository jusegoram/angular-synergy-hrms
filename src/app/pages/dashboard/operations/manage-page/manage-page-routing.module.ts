import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagePageComponent } from './manage-page.component';

const routes: Routes = [
  {
    path: '',
    component: ManagePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePageRoutingModule {}
