import { TrackersComponent } from "./trackers/trackers.component";
import { HrService } from "./hr.service";
import { HrRoutingModule } from "./hr.routing";
import { NgModule } from "@angular/core";
import { CommonModule, TitleCasePipe, DatePipe } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MaterialSharedModule } from "../shared/material.shared.module";
import { SharedModule } from "../shared/shared.module";
import { FileUploadModule } from "ng2-file-upload";
import { FormsModule } from "@angular/forms";
import { TokenInterceptor } from "../token-interceptor.service";
import { AuthenticationService } from "../authentication.service";
import { EmployeeService } from "../employee/employee.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { TrackerStatusPipe } from './pipes/tracker-status.pipe';
import { TrackerTypePipe } from './pipes/tracker-type.pipe';
import { MomentModule } from 'ngx-moment';
import { TrackerTransferDetailsComponent } from './components/tracker-transfer-details/tracker-transfer-details.component';
import { TrackerCertifyTrainingDetailsComponent } from './components/tracker-certify-training-details/tracker-certify-training-details.component';
import { TrackerInfoChangeRequestDetailsComponent } from './components/tracker-info-change-request-details/tracker-info-change-request-details.component';
import { TrackerStatusChangeDetailsComponent } from './components/tracker-status-change-details/tracker-status-change-details.component';
import { SignatureRenderModalComponent } from './components/signature-render-modal/signature-render-modal.component';

@NgModule({
  imports: [
    CommonModule,
    HrRoutingModule,
    MaterialSharedModule,
    SharedModule,
    HttpClientModule,
    FileUploadModule,
    FormsModule,
    NgxDatatableModule,
    MomentModule
  ],
  declarations: [TrackersComponent, TrackerStatusPipe, TrackerTypePipe, TrackerTransferDetailsComponent, TrackerCertifyTrainingDetailsComponent, TrackerInfoChangeRequestDetailsComponent, TrackerStatusChangeDetailsComponent, SignatureRenderModalComponent],
  entryComponents: [SignatureRenderModalComponent],
  providers: [
    HrService,
    TitleCasePipe,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationService,
      multi: true,
    },
    EmployeeService
  ],
})
export class HrModule {}
