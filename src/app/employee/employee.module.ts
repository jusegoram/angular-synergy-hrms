import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { UploadComponent } from './upload/upload.component';
import { ReportComponent } from './report/report.component';
import { DownloadComponent } from './download/download.component';
import { DetailComponent } from './detail/detail.component';
import { ManageComponent } from './manage/manage.component';
import { EmployeeRoutingModule } from './employee.routing';
import {PersonalComponent } from '../employee/detail/personal/personal.component';
import { FamilyComponent } from '../employee/detail/family/family.component';
import { PayrollComponent } from '../employee/detail/payroll/payroll.component';
import { PositionComponent } from '../employee/detail/position/position.component';
import { MaterialSharedModule } from '../shared/material.shared.module';
import { CommonModule } from '@angular/common';
import { EmployeeService } from './services/employee.service';
import { HttpModule } from '@angular/http';
import { FileSelectDirective } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ChartsModule,
    NgxDatatableModule,
    FlexLayoutModule,
    MaterialSharedModule,
    HttpModule,
  ],
  declarations: [
    UploadComponent,
    ReportComponent,
    DownloadComponent,
    DetailComponent,
    ManageComponent,
    PersonalComponent,
    FamilyComponent,
    PositionComponent,
    PayrollComponent,
    FileSelectDirective ],
  providers: [
    EmployeeService]
})

export class EmployeeModule {}
