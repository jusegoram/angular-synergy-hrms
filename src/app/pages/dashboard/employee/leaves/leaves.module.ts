import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';

import { LeavesRoutingModule } from './leaves-routing.module';
import { LeavesComponent } from './leaves.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { SharedModule } from '@synergy-app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MomentModule } from 'ngx-moment';
import { GenerateLeaveModalComponent } from './components/generate-leave-modal/generate-leave-modal.component';
import { LeaveStatusPipe } from '@synergy-app/shared/pipes/leave-status.pipe';
import { ModalsModule } from '@synergy-app/shared/modals/modals.module';

@NgModule({
  declarations: [LeavesComponent, GenerateLeaveModalComponent],
  imports: [
    CommonModule,
    LeavesRoutingModule,
    MaterialSharedModule,
    SharedModule,
    FormsModule,
    NgxDatatableModule,
    MomentModule,
    ModalsModule
  ],
  providers: [TitleCasePipe, DatePipe, LeaveStatusPipe],
  entryComponents: [GenerateLeaveModalComponent],
})
export class LeavesModule {}
