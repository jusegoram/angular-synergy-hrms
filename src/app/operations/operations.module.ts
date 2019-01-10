import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';

import { OperationsRoutingModule } from './operations.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CloudUploadComponent } from './cloud-upload/cloud-upload.component';
import { ManageComponent } from './manage/manage.component';
import { ReportComponent } from './report/report.component';
import { OperationsService } from './operations.service';
import { MaterialSharedModule } from '../shared/material.shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    OperationsRoutingModule,
    MaterialSharedModule,
    HttpClientModule,
    NgxDatatableModule,
    FileUploadModule,
    FormsModule
  ],
  declarations: [DashboardComponent, CloudUploadComponent, ManageComponent, ReportComponent],
  providers: [
    OperationsService, TitleCasePipe, DatePipe]
})
export class OperationsModule { }
