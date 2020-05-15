import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { DetailPageRoutingModule } from './detail-page-routing.module';
import { DetailPageComponent } from './detail-page.component';
import { SharedModule, MaterialSharedModule } from '@synergy-app/shared';
import { DetailResolver } from './detail-page.resolver';
import { PersonalComponent } from './personal/personal.component';
import { FamilyComponent } from './family/family.component';
import { PayrollComponent } from './payroll/payroll.component';
import { PositionComponent } from './position/position.component';
import { DialogComponent } from './position/dialog/dialog.component';
import { CommentComponent } from './comment/comment.component';
import { PersonalEditDialogComponent } from './personal/edit-dialog/personal-edit-dialog.component';
import { PayrollEditDialogComponent } from './payroll/payroll-edit-dialog/payroll-edit-dialog.component';
import { FamilyEditDialogComponent } from './family/family-edit-dialog/family-edit-dialog.component';
import { ShiftComponent } from './shift/shift.component';
import { AttritionComponent } from './attrition/attrition.component';
import { CompanyComponent } from './company/company.component';
import { MainComponent } from './main/main.component';
import { RequestInfoChangeDialogComponent } from './containers/request-info-change-dialog/request-info-change-dialog.component';
import { StatusDialogComponent } from './containers/status-dialog/status-dialog.component';
import { TransferDialogComponent } from './containers/transfer-dialog/transfer-dialog.component';
import { CertifyDialogComponent } from './containers/certify-dialog/certify-dialog.component';
import { MinutesHoursPipe } from '@synergy-app/shared/pipes';


@NgModule({
  declarations: [
    DetailPageComponent,
    PersonalComponent,
    FamilyComponent,
    PositionComponent,
    PayrollComponent,
    RequestInfoChangeDialogComponent,
    StatusDialogComponent,
    TransferDialogComponent,
    CertifyDialogComponent,
    DialogComponent,
    CommentComponent,
    PayrollEditDialogComponent,
    PayrollEditDialogComponent,
    FamilyEditDialogComponent,
    PersonalEditDialogComponent,
    ShiftComponent,
    AttritionComponent,
    CompanyComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    DetailPageRoutingModule,
    SharedModule,
    MaterialSharedModule
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
  ],
  providers: [
    DetailResolver,
    MinutesHoursPipe,
    TitleCasePipe
  ]
})
export class DetailPageModule { }
