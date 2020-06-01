import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayslipsPageComponent } from './payslips-page.component';

const routes: Routes = [
  {
    path: '',
    component: PayslipsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayslipsPageRoutingModule {}
