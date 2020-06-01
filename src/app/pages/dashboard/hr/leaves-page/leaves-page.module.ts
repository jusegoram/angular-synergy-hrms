import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { LeavesRoutingModule } from './leaves-page-routing.module';
import { LeavesPageComponent } from './leaves-page.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { SharedModule } from '@synergy-app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MomentModule } from 'ngx-moment';
import { LeaveStatusPipe } from '@synergy-app/shared/pipes/leave-status.pipe';

@NgModule({
  declarations: [LeavesPageComponent],
  imports: [
    CommonModule,
    LeavesRoutingModule,
    MaterialSharedModule,
    SharedModule,
    FormsModule,
    NgxDatatableModule,
    MomentModule,
  ],
  providers: [TitleCasePipe, DatePipe, LeaveStatusPipe],
})
export class LeavesModule {}
