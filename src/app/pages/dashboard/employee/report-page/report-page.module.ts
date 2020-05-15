import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportPageRoutingModule } from './report-page-routing.module';
import { ReportPageComponent } from './report-page.component';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';
import { ReportService } from '@synergy-app/pages/dashboard/employee/report-page/services/report.service';

@NgModule({
  declarations: [ReportPageComponent],
  imports: [CommonModule, ReportPageRoutingModule, MaterialSharedModule, SharedModule],
  providers: [ReportService],
})
export class ReportPageModule {}
