import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { DetailPageRoutingModule } from './detail-page-routing.module';
import { DetailPageComponent } from './detail-page.component';
import { FusionChartsModule } from 'angular-fusioncharts';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {
  EditPayrollDetailVacationsComponent
} from './edit-payroll-detail/edit-payroll-detail-vacations/edit-payroll-detail-vacations.component';
import { DetailResolver } from './detail-page.resolver';
import { EditPayrollDetailComponent } from './edit-payroll-detail/edit-payroll-detail.component';
import { PayrollService } from '../services/payroll.service';
import { CdkColumnDef } from '@angular/cdk/table';
import { MinuteSecondsPipe } from '@synergy-app/shared/pipes';

@NgModule({
  declarations: [DetailPageComponent, EditPayrollDetailVacationsComponent, EditPayrollDetailComponent],
  imports: [
    CommonModule,
    DetailPageRoutingModule,
    FusionChartsModule,
    MaterialSharedModule,
    NgxDatatableModule,
    SharedModule,
  ],
  providers: [DetailResolver, PayrollService, CdkColumnDef, DatePipe, CurrencyPipe, MinuteSecondsPipe],
  entryComponents: [EditPayrollDetailComponent],
})
export class DetailPageModule {}
