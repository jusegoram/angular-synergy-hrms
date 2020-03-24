import {TrackersComponent} from './trackers/trackers.component';
import {TimeOffComponent} from './time-off/time-off.component';
import {HrService} from './hr.service';
import {HrRoutingModule} from './hr.routing';
import {NgModule} from '@angular/core';
import {CommonModule, DatePipe, TitleCasePipe} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MaterialSharedModule} from '../shared/material.shared.module';
import {SharedModule} from '../shared/shared.module';
import {FileUploadModule} from 'ng2-file-upload';
import {FormsModule} from '@angular/forms';
import {TokenInterceptor} from '../token-interceptor.service';
import {AuthenticationService} from '../authentication.service';

@NgModule({
  imports: [
    CommonModule,
    HrRoutingModule,
    MaterialSharedModule,
    SharedModule,
    HttpClientModule,
    FileUploadModule,
    FormsModule,

  ],
  declarations: [
    TimeOffComponent,
    TrackersComponent
  ],
  entryComponents: [],
  providers: [
    HrService, TitleCasePipe, DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationService,
      multi: true
    }]
})
export class HrModule { }
