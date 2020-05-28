import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailPageComponent } from './detail-page.component';
import { DetailResolver } from './resolvers/detail-page.resolver';
import { FusionChartsModule } from 'angular-fusioncharts';

const routes: Routes = [
  {
    path: '',
    component: DetailPageComponent,
    resolve: {payroll: DetailResolver},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailPageRoutingModule { }
