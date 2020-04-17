import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';

import { TrainingRoutingModule } from './training.routing';
import { DownloadsComponent } from './downloads/downloads.component';
import { ManageComponent } from './manage/manage.component';
import { ReportsComponent } from './reports/reports.component';
import { UploadsComponent } from './uploads/uploads.component';
import { TrainingService } from './training.service';
import { TrainingResolver } from './training.resolver';

@NgModule({
  imports: [CommonModule, TrainingRoutingModule],
  declarations: [DownloadsComponent, ManageComponent, ReportsComponent, UploadsComponent],
  providers: [
    TrainingService,
    TrainingResolver,
    TitleCasePipe,
    DatePipe
  ],
})
export class TrainingModule {}
