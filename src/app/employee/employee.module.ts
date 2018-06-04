import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
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
import { CommonModule, TitleCasePipe } from '@angular/common';
import { EmployeeService } from './services/employee.service';
import { HttpModule } from '@angular/http';
import { FileUploadModule } from 'ng2-file-upload';
import { AvatarComponent } from './detail/avatar/avatar.component';
import { DialogComponent } from './detail/position/dialog/dialog.component';
import { CommentComponent } from './detail/comment/comment.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FlexLayoutModule,
    MaterialSharedModule,
    HttpModule,
    HttpClientModule,
    NgxDatatableModule,
    FileUploadModule,
    FormsModule,
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
    AvatarComponent,
    DialogComponent,
    CommentComponent ],
    entryComponents: [
    DialogComponent
    ],
  providers: [
    EmployeeService, TitleCasePipe ]
})

export class EmployeeModule {}
