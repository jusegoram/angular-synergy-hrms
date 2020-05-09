import { PayslipDialogComponent } from './components/payslips/payslip-dialog/payslip-dialog.component';
import { PayedPayrollsComponent } from './components/main/payed-payrolls/payed-payrolls.component';
import { NonFinalizedPayrollsComponent } from './components/main/non-finalized-payrolls/non-finalized-payrolls.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EditPayrollDetailVacationsComponent } from './components/detail/edit-payroll-detail/edit-payroll-detail-vacations/edit-payroll-detail-vacations.component';
import { MinuteSecondsPipe } from '@synergy-app/shared/pipes/minute-seconds.pipe';
import { DetailResolver } from './components/detail/detail.resolver';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { PayrollRoutingModule } from './payroll-routing.module';
import { UploadComponent } from './components/upload/upload.component';
import { PayslipsComponent } from './components/payslips/payslips.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { PayrollService } from './services/payroll.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CdkColumnDef } from '@angular/cdk/table';
import { ExportBottomSheetComponent } from './components/new-payroll/export-bottom-sheet/export-bottom-sheet.component';
import { NewPayrollComponent } from './components/new-payroll/new-payroll.component';
import { MainComponent } from './components/main/main.component';
import { DetailComponent } from './components/detail/detail.component';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as ExcelExport from 'fusioncharts/fusioncharts.excelexport';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { ExportAsModule } from 'ngx-export-as';
import { ConceptsComponent } from './components/concepts/concepts.component';
import { NewConceptComponent } from './components/concepts/new-concept/new-concept.component';
// tslint:disable-next-line:max-line-length
import { ConceptVerificationComponent } from './components/concepts/concept-verification/concept-verification.component';
import { FinalizedPayrollsComponent } from './components/main/finalized-payrolls/finalized-payrolls.component';
import { EditPayrollDetailComponent } from './components/detail/edit-payroll-detail/edit-payroll-detail.component';
import { ReportComponent } from './components/report/report.component';
import { SharedModule } from '@synergy-app/shared/shared.module';
import { ModalsModule } from '@synergy-app/shared/modals/modals.module';
import { LeavesComponent } from './components/concepts/leaves/leaves.component';

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme, ExcelExport);

export function provideSwal() {
  return import('sweetalert2/src/sweetalert2.js'); // instead of import('sweetalert2')
}

@NgModule({
  imports: [
    CommonModule,
    PayrollRoutingModule,
    MaterialSharedModule,
    FileUploadModule,
    FormsModule,
    NgxDatatableModule,
    FusionChartsModule,
    ExportAsModule,
    SweetAlert2Module.forRoot({ provideSwal }),
    SharedModule,
    ModalsModule
  ],
  declarations: [
    NewPayrollComponent,
    UploadComponent,
    PayslipsComponent,
    ExportBottomSheetComponent,
    MainComponent,
    DetailComponent,
    ConceptsComponent,
    NewConceptComponent,
    FinalizedPayrollsComponent,
    NonFinalizedPayrollsComponent,
    PayedPayrollsComponent,
    ConceptVerificationComponent,
    EditPayrollDetailComponent,
    EditPayrollDetailVacationsComponent,
    PayslipDialogComponent,
    ReportComponent,
    LeavesComponent,
  ],
  providers: [
    PayrollService,
    DetailResolver,
    TitleCasePipe,
    MinuteSecondsPipe,
    CdkColumnDef,
    CurrencyPipe,
    DatePipe
  ],
  entryComponents: [PayslipDialogComponent, ExportBottomSheetComponent, EditPayrollDetailComponent],
})
export class PayrollModule {}
