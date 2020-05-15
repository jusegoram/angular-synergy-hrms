import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageEmployeesComponent } from './manage-employees-page.component';


const routes: Routes = [{
  path: '',
  component: ManageEmployeesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEmployeesPageRoutingModule { }
