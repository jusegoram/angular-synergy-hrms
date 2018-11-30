import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';
import { MainComponent } from './components/main/main.component';
import { UploadComponent } from './components/upload/upload.component';
import { ExportComponent } from './components/export/export.component';
import { PayslipsComponent } from './components/payslips/payslips.component';
import { BonusComponent } from './components/bonus/bonus.component';
import { DeductionComponent } from './components/deduction/deduction.component';
import {MaterialSharedModule} from '../shared/material.shared.module';
import {FileUploadModule} from 'ng2-file-upload';
import {FormsModule} from '@angular/forms';
import {PayrollService} from './services/payroll.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    PayrollRoutingModule,
    MaterialSharedModule,
    HttpClientModule,
    FileUploadModule,
    FormsModule,
    NgxDatatableModule
  ],
  declarations: [MainComponent, UploadComponent, ExportComponent, PayslipsComponent, BonusComponent, DeductionComponent],
  providers: [ PayrollService, TitleCasePipe ]

})
export class PayrollModule { }
