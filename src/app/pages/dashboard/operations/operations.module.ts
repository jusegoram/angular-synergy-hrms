import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationsRoutingModule } from './operations.routing';
import { OperationsService } from '@synergy-app/core/services/operations.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ExportAsModule } from 'ngx-export-as';
// Import angular-fusioncharts
// import { FusionChartsModule } from 'angular-fusioncharts';

// Pass the fusioncharts library and chart modules
// FusionChartsModule.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

@NgModule({
  imports: [
    CommonModule,
    OperationsRoutingModule,
    // FusionChartsModule,
    ScrollingModule,
    ExportAsModule,
  ],
  declarations: [],
  providers: [OperationsService],
})
export class OperationsModule {}
