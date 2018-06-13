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
import { NewComponent } from './new/new.component';
import { PersonalEditDialogComponent } from './detail/personal/edit-dialog/personal-edit-dialog.component';
import { PayrollEditDialogComponent } from './detail/payroll/payroll-edit-dialog/payroll-edit-dialog.component';
import { FamilyEditDialogComponent } from './detail/family/family-edit-dialog/family-edit-dialog.component';
import { DetailEditDialogComponent } from './detail/detail-edit-dialog/detail-edit-dialog.component';
import {EmployeeResolver} from './services/employee.resolver';

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
    CommentComponent,
    NewComponent,
    PayrollEditDialogComponent,
    PayrollEditDialogComponent,
    FamilyEditDialogComponent,
    DetailEditDialogComponent,
    PersonalEditDialogComponent
    ],
    entryComponents: [
      DialogComponent,
      PayrollEditDialogComponent,
      PayrollEditDialogComponent,
      FamilyEditDialogComponent,
      DetailEditDialogComponent,
      PersonalEditDialogComponent
    ],
  providers: [
    EmployeeService, EmployeeResolver, TitleCasePipe ]
})

export class EmployeeModule {}
