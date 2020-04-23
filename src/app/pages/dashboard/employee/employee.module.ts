import { SharedModule } from '../../../shared/shared.module';
import { RequestInfoChangeDialogComponent } from './detail/request-info-change-dialog/request-info-change-dialog.component';
import { CertifyDialogComponent } from './detail/certify-dialog/certify-dialog.component';
import { TransferDialogComponent } from './detail/transfer-dialog/transfer-dialog.component';
import { StatusDialogComponent } from './detail/status-dialog/status-dialog.component';
import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { UploadComponent } from './upload/upload.component';
import { ReportComponent } from './report/report.component';
import { DetailComponent } from './detail/detail.component';
import { ManageComponent } from './manage/manage.component';
import { EmployeeRoutingModule } from './employee.routing';
import { PersonalComponent } from './detail/personal/personal.component';
import { FamilyComponent } from './detail/family/family.component';
import { PayrollComponent } from './detail/payroll/payroll.component';
import { PositionComponent } from './detail/position/position.component';
import { MaterialSharedModule } from '../../../shared/material.shared.module';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { AvatarComponent } from './detail/avatar/avatar.component';
import { DialogComponent } from './detail/position/dialog/dialog.component';
import { CommentComponent } from './detail/comment/comment.component';
import { NewComponent } from './new/new.component';
import { PersonalEditDialogComponent } from './detail/personal/edit-dialog/personal-edit-dialog.component';
import { PayrollEditDialogComponent } from './detail/payroll/payroll-edit-dialog/payroll-edit-dialog.component';
import { FamilyEditDialogComponent } from './detail/family/family-edit-dialog/family-edit-dialog.component';
import { DetailResolver } from './detail/detail.resolver';
import { ShiftComponent } from './detail/shift/shift.component';
import { AttritionComponent } from './detail/attrition/attrition.component';
import { AvailableInformationComponent } from './report/available-information/available-information.component';
import { PipeModule } from '@synergy-app/shared/pipes/pipe/pipe.module';
import { ModalsModule } from '@synergy-app/shared/modals/modals.module';
import { CompanyComponent } from './detail/company/company.component';
import { MainComponent } from './detail/main/main.component';
import { SuperiorsComponent } from './superiors/superiors.component';
import { SuperiorsService } from './superiors/superiors.service';
import { RangesFooterComponent } from '@synergy-app/shared/ranges-footer/ranges-footer.component';
import { MinutesHoursPipe } from '@synergy-app/shared/pipes/minutes-hours.pipe';
import { TrackerStatusPipe } from '@synergy-app/shared/pipes/tracker-status.pipe';
import { TrackerTypePipe } from '@synergy-app/shared/pipes/tracker-type.pipe';
import { ReportService } from '@synergy-app/pages/dashboard/employee/report/report.service';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    MaterialSharedModule,
    SharedModule,
    ModalsModule.forRoot(),
    NgxDatatableModule,
    FileUploadModule,
    FormsModule,
    PipeModule.forRoot(),
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
    RequestInfoChangeDialogComponent,
    StatusDialogComponent,
    TransferDialogComponent,
    CertifyDialogComponent,
    DialogComponent,
    CommentComponent,
    NewComponent,
    PayrollEditDialogComponent,
    PayrollEditDialogComponent,
    FamilyEditDialogComponent,
    PersonalEditDialogComponent,
    ShiftComponent,
    AttritionComponent,
    AvailableInformationComponent,
    CompanyComponent,
    MainComponent,
    SuperiorsComponent
  ],
  entryComponents: [
    RequestInfoChangeDialogComponent,
    CertifyDialogComponent,
    TransferDialogComponent,
    StatusDialogComponent,
    DialogComponent,
    PayrollEditDialogComponent,
    PayrollEditDialogComponent,
    FamilyEditDialogComponent,
    PersonalEditDialogComponent,
    RangesFooterComponent,
  ],
  providers: [
    ReportService,
    SuperiorsService,
    DetailResolver,
    TitleCasePipe,
    DatePipe,
    MinutesHoursPipe,
    TrackerStatusPipe,
    TrackerTypePipe
  ],
})
export class EmployeeModule {}
