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
  declarations: [TrackersComponent, TrackerStatusPipe, TrackerTypePipe],
  entryComponents: [],
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
