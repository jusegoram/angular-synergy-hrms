import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayrollPageComponent } from './payroll-page.component';


const routes: Routes = [{
  path: '',
  component: PayrollPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollPageRoutingModule { }
