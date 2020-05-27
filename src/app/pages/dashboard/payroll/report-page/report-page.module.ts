import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPageRoutingModule } from './report-page-routing.module';
import { ReportPageComponent } from './report-page.component';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';


@NgModule({
  declarations: [ ReportPageComponent ],
  imports: [
    CommonModule,
    ReportPageRoutingModule,
    MaterialSharedModule,
    SharedModule
  ]
})
export class ReportPageModule { }
