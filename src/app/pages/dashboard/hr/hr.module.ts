import { NgModule } from '@angular/core';
import { HrRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@synergy-app/shared/shared.module';

@NgModule({
  imports: [CommonModule, HrRoutingModule, SharedModule],
  declarations: [HrComponent],
  providers: [],
})
export class HrModule {}
