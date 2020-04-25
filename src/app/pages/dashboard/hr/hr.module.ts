import { NgModule } from '@angular/core';
import { HrRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HrRoutingModule,
  ],
  declarations: [
    HrComponent
  ],
  providers: [],
})
export class HrModule {}
