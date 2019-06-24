import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { UploadComponent } from './upload/upload.component';
import { ReportComponent } from './report/report.component';
import { DetailComponent } from './detail/detail.component';
import { ManageComponent } from './manage/manage.component';
import { EmployeeRoutingModule } from './employee.routing';
import {PersonalComponent } from '../employee/detail/personal/personal.component';
import { FamilyComponent } from '../employee/detail/family/family.component';
import { PayrollComponent } from '../employee/detail/payroll/payroll.component';
import { PositionComponent } from '../employee/detail/position/position.component';
import { MaterialSharedModule } from '../shared/material.shared.module';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { EmployeeService } from './employee.service';
import { FileUploadModule } from 'ng2-file-upload';
import { AvatarComponent } from './detail/avatar/avatar.component';
import { DialogComponent } from './detail/position/dialog/dialog.component';
import { CommentComponent } from './detail/comment/comment.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { NewComponent } from './new/new.component';
import { PersonalEditDialogComponent } from './detail/personal/edit-dialog/personal-edit-dialog.component';
import { PayrollEditDialogComponent } from './detail/payroll/payroll-edit-dialog/payroll-edit-dialog.component';
import { FamilyEditDialogComponent } from './detail/family/family-edit-dialog/family-edit-dialog.component';
import {DetailResolver} from './detail/detail.resolver';
import { ShiftComponent } from './detail/shift/shift.component';
import { AttritionComponent } from './detail/attrition/attrition.component';
import { TokenInterceptor } from '../token-interceptor.service';
import { AuthenticationService } from '../authentication.service';
import { AvailableInformationComponent } from './report/available-information/available-information.component';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    MaterialSharedModule,
    HttpClientModule,
    NgxDatatableModule,
    FileUploadModule,
    FormsModule,

  ],
  declarations: [
    UploadComponent,
    ReportComponent,
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
    PersonalEditDialogComponent,
    ShiftComponent,
    AttritionComponent,
    AvailableInformationComponent
    ],
    entryComponents: [
      DialogComponent,
      PayrollEditDialogComponent,
      PayrollEditDialogComponent,
      FamilyEditDialogComponent,
      PersonalEditDialogComponent
    ],
  providers: [
    EmployeeService, DetailResolver, TitleCasePipe, DatePipe,
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

export class EmployeeModule {}
