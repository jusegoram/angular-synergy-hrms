import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe, AsyncPipe } from '@angular/common';
import { DetailPageRoutingModule } from './detail-page-routing.module';
import { DetailPageComponent } from './detail-page.component';
import { SharedModule, MaterialSharedModule } from '@synergy-app/shared';
import { DetailResolver } from './resolvers/detail-page.resolver';
import { PersonalComponent } from './components/personal/personal.component';
import { FamilyComponent } from './components/family/family.component';
import { PayrollComponent } from './components/payroll/payroll.component';
import { PositionComponent } from './components/position/position.component';
import {
  PositionConfirmationDialogComponent
} from './components/position-confirmation-dialog/position-confirmation-dialog.component';
import { CommentComponent } from './components/comment/comment.component';
import { ShiftComponent } from './components/shift/shift.component';
import { AttritionComponent } from './components/attrition/attrition.component';
import { CompanyComponent } from './components/company/company.component';
import { MainComponent } from './components/main/main.component';
import {
  RequestInfoChangeDialogComponent
} from './containers/request-info-change-dialog/request-info-change-dialog.component';
import { StatusDialogComponent } from './containers/status-dialog/status-dialog.component';
import { TransferDialogComponent } from './containers/transfer-dialog/transfer-dialog.component';
import { CertifyDialogComponent } from './containers/certify-dialog/certify-dialog.component';
import { MinutesHoursPipe } from '@synergy-app/shared/pipes';
import { FormsModule } from '@angular/forms';


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
    PositionConfirmationDialogComponent,
    CommentComponent,
    ShiftComponent,
    AttritionComponent,
    CompanyComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    DetailPageRoutingModule,
    SharedModule,
    MaterialSharedModule,
    FormsModule
  ],
  entryComponents: [
    RequestInfoChangeDialogComponent,
    CertifyDialogComponent,
    TransferDialogComponent,
    StatusDialogComponent,
    PositionConfirmationDialogComponent,
  ],
  providers: [
    DetailResolver,
    MinutesHoursPipe,
    TitleCasePipe,
    AsyncPipe
  ]
})
export class DetailPageModule { }
