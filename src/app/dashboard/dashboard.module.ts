import { DashboardService } from './dashboard.service';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { MaterialSharedModule } from '../shared/material.shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../token-interceptor.service';
import { AuthenticationService } from '../authentication.service';
//import { FusionChartsModule } from 'angular-fusioncharts';
//import * as FusionCharts from 'fusioncharts';
//import * as Charts from 'fusioncharts/fusioncharts.charts';
//import * as Widgets from 'fusioncharts/fusioncharts.widgets';
//import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
//import * as TimeSeries from 'fusioncharts/fusioncharts.timeseries';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../../environments/environment';

//const config: SocketIoConfig = { url: environment.apiUrl + '/dashboard', options: {} };
//FusionChartsModule.fcRoot(FusionCharts, Charts, Widgets, FusionTheme, TimeSeries);

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
   // SocketIoModule.forRoot(config),
    MaterialSharedModule,
    //FusionChartsModule
  ],
  declarations: [ DashboardComponent,
    ], providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthenticationService,
        multi: true
      },
      DashboardService
    ]
})

export class DashboardModule {}
