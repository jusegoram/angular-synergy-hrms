import {NgModule} from '@angular/core';
import {CommonModule, DatePipe, TitleCasePipe} from '@angular/common';

import {TrainingRoutingModule} from './training.routing';
import {DownloadsComponent} from './downloads/downloads.component';
import {ManageComponent} from './manage/manage.component';
import {ReportsComponent} from './reports/reports.component';
import {UploadsComponent} from './uploads/uploads.component';
import {TrainingService} from './training.service';
import {TrainingResolver} from './training.resolver';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from '../token-interceptor.service';
import {AuthenticationService} from '../authentication.service';

@NgModule({
  imports: [CommonModule, TrainingRoutingModule],
  declarations: [
    DownloadsComponent,
    ManageComponent,
    ReportsComponent,
    UploadsComponent,
  ],
  providers: [
    TrainingService,
    TrainingResolver,
    TitleCasePipe,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationService,
      multi: true,
    },
  ],
})
export class TrainingModule {}
