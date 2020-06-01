import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeePageComponent } from './employee-page.component';


const routes: Routes = [{
  path: '',
  component: EmployeePageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeePageRoutingModule { }
