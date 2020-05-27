import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConceptsPageComponent } from './concepts-page.component';


const routes: Routes = [
  {
    path: '',
    component: ConceptsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConceptsPageRoutingModule { }
