import { NgModule } from '@angular/core';
import { HrRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';
import { TrackersComponent } from './trackers/trackers.component';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { SharedModule } from '@synergy-app/shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '@synergy-app/shared/services/employee.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MomentModule } from 'ngx-moment';
import { TrackerTransferDetailsComponent } from './components/tracker-transfer-details/tracker-transfer-details.component';
import { TrackerCertifyTrainingDetailsComponent } from './components/tracker-certify-training-details/tracker-certify-training-details.component';
import { TrackerInfoChangeRequestDetailsComponent } from './components/tracker-info-change-request-details/tracker-info-change-request-details.component';
import { TrackerStatusChangeDetailsComponent } from './components/tracker-status-change-details/tracker-status-change-details.component';
import { SignatureRenderModalComponent } from './components/signature-render-modal/signature-render-modal.component';
import { TrackersInboxTableComponent } from './components/trackers-inbox-table/trackers-inbox-table.component';
import { AcceptedTrackersTableComponent } from './components/accepted-trackers-table/accepted-trackers-table.component';

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
    MomentModule,
  ],
  declarations: [
    HrComponent,
    TrackersComponent,
    TrackerTransferDetailsComponent,
    TrackerCertifyTrainingDetailsComponent,
    TrackerInfoChangeRequestDetailsComponent,
    TrackerStatusChangeDetailsComponent,
    SignatureRenderModalComponent,
    TrackersInboxTableComponent,
    AcceptedTrackersTableComponent,
  ],
  entryComponents: [SignatureRenderModalComponent],
  providers: [
    TitleCasePipe,
    DatePipe,
  ],
})
export class HrModule {}
