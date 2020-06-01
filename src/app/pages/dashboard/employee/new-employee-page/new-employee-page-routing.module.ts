import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewEmployeePageComponent } from './new-employee-page.component';

const routes: Routes = [
  {
    path: '',
    component: NewEmployeePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewEmployeePageRoutingModule {}
