import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';
import { MainComponent } from './components/main/main.component';
import { UploadComponent } from './components/upload/upload.component';
import { ExportComponent } from './components/export/export.component';
import { PayslipsComponent } from './components/payslips/payslips.component';
import { PayrollConceptsComponent } from './components/concepts/payrollConcepts.component';
import {MaterialSharedModule} from '../shared/material.shared.module';
import {FileUploadModule} from 'ng2-file-upload';
import {FormsModule} from '@angular/forms';
import {PayrollService} from './services/payroll.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { TokenInterceptor } from '../token-interceptor.service';
import { AuthenticationService } from '../authentication.service';
import { CdkColumnDef } from '@angular/cdk/table';
import { ConceptComponent } from './components/concepts/concept/concept.component';

@NgModule({
  imports: [
    CommonModule,
    PayrollRoutingModule,
    MaterialSharedModule,
    HttpClientModule,
    FileUploadModule,
    FormsModule,
    NgxDatatableModule,

  ],
  declarations: [MainComponent, UploadComponent, ExportComponent, PayslipsComponent, PayrollConceptsComponent, ConceptComponent],
  providers: [ PayrollService, TitleCasePipe, CdkColumnDef,
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
export class PayrollModule { }
