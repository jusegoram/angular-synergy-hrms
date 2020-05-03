import { NgModule } from '@angular/core';
import { HrRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { SharedModule } from '@synergy-app/shared/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    HrRoutingModule,
    SharedModule,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule
  ],
  declarations: [
    HrComponent,
    ReportsComponent
  ],
  providers: [],
})
export class HrModule {}
