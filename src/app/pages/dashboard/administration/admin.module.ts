import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { AdminRoutingModule } from './admin.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialSharedModule,
    FormsModule,
    NgxDatatableModule,
  ],
  declarations: [],
  providers: [],
})
export class AdminModule {}
