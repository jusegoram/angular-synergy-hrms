import { SharedModule } from '../../../shared/shared.module';
import { RequestInfoChangeDialogComponent } from './detail-page/containers/request-info-change-dialog/request-info-change-dialog.component';
import { CertifyDialogComponent } from './detail-page/containers/certify-dialog/certify-dialog.component';
import { TransferDialogComponent } from './detail-page/containers/transfer-dialog/transfer-dialog.component';
import { StatusDialogComponent } from './detail-page/containers/status-dialog/status-dialog.component';
import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { UploadPageComponent } from './upload-page/upload.component';
import { ReportPageComponent } from './report-page/report-page.component';
import { DetailPageComponent } from './detail-page/detail-page.component';
import { ManageEmployeesComponent } from './manage-employees-page/manage-employees-page.component';
import { EmployeeRoutingModule } from './employee.routing';
import { PersonalComponent } from './detail-page/personal/personal.component';
import { FamilyComponent } from './detail-page/family/family.component';
import { PayrollComponent } from './detail-page/payroll/payroll.component';
import { PositionComponent } from './detail-page/position/position.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { AvatarComponent } from './detail-page/avatar/avatar.component';
import { DialogComponent } from './detail-page/position/dialog/dialog.component';
import { CommentComponent } from './detail-page/comment/comment.component';
import { NewEmployeePageComponent } from './new-employee-page/new-employee-page.component';
import { PersonalEditDialogComponent } from './detail-page/personal/edit-dialog/personal-edit-dialog.component';
import { PayrollEditDialogComponent } from './detail-page/payroll/payroll-edit-dialog/payroll-edit-dialog.component';
import { FamilyEditDialogComponent } from './detail-page/family/family-edit-dialog/family-edit-dialog.component';
import { DetailResolver } from './detail-page/detail-page.resolver';
import { ShiftComponent } from './detail-page/shift/shift.component';
import { AttritionComponent } from './detail-page/attrition/attrition.component';
import {
  AvailableInformationComponent
} from './report-page/containers/available-information/available-information.component';
import { CompanyComponent } from './detail-page/company/company.component';
import { MainComponent } from './detail-page/main/main.component';
import { SuperiorsPageComponent } from './superiors-page/superiors-page.component';
import { SuperiorsService } from './superiors-page/services/superiors.service';
import { RangesFooterComponent } from '@synergy-app/shared/components/ranges-footer/ranges-footer.component';
import { MinutesHoursPipe } from '@synergy-app/shared/pipes/minutes-hours.pipe';
import { TrackerStatusPipe } from '@synergy-app/shared/pipes/tracker-status.pipe';
import { TrackerTypePipe } from '@synergy-app/shared/pipes/tracker-type.pipe';
import { ReportService } from '@synergy-app/pages/dashboard/employee/report-page/services/report.service';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    MaterialSharedModule,
    SharedModule,
    NgxDatatableModule,
    FileUploadModule,
    FormsModule,
  ],
  declarations: [
    UploadPageComponent,
    ReportPageComponent,
    DetailPageComponent,
    ManageEmployeesComponent,
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
    NewEmployeePageComponent,
    PayrollEditDialogComponent,
    PayrollEditDialogComponent,
    FamilyEditDialogComponent,
    PersonalEditDialogComponent,
    ShiftComponent,
    AttritionComponent,
    AvailableInformationComponent,
    CompanyComponent,
    MainComponent,
    SuperiorsPageComponent
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
    TrackerTypePipe,
  ],
})
export class EmployeeModule {}
