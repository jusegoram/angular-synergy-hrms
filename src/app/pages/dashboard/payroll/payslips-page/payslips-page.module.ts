import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { PayslipsPageRoutingModule } from './payslips-page-routing.module';
import { PayslipsPageComponent } from './payslips-page.component';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';
import { PayslipDialogComponent } from './containers/payslip-dialog/payslip-dialog.component';
import { PayrollService } from '../services/payroll.service';
import { ExportAsModule } from 'ngx-export-as';
import { MinuteSecondsPipe } from '@synergy-app/shared/pipes';

@NgModule({
  declarations: [PayslipsPageComponent, PayslipDialogComponent],
  imports: [
    CommonModule,
    PayslipsPageRoutingModule,
    MaterialSharedModule,
    SharedModule,
    ExportAsModule
  ],
  entryComponents: [PayslipDialogComponent],
  providers: [PayrollService, DatePipe, CurrencyPipe, MinuteSecondsPipe]
})
export class PayslipsPageModule { }
