import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewPayrollPageComponent } from './new-payroll-page.component';


const routes: Routes = [
  {
    path: '',
    component: NewPayrollPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewPayrollPageRoutingModule { }
