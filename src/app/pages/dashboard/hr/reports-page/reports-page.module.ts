import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsPageRoutingModule } from './reports-page-routing.module';
import { ReportsPageComponent } from './reports-page.component';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';


@NgModule({
  declarations: [ ReportsPageComponent ],
  imports: [
    CommonModule,
    ReportsPageRoutingModule,
    MaterialSharedModule,
    SharedModule,
  ]
})
export class ReportsPageModule { }
