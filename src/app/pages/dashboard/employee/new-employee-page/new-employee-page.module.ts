import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewEmployeePageRoutingModule } from './new-employee-page-routing.module';
import { NewEmployeePageComponent } from './new-employee-page.component';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NewEmployeePageComponent
  ],
  imports: [
    CommonModule,
    NewEmployeePageRoutingModule,
    MaterialSharedModule,
    FormsModule,
    SharedModule
  ]
})
export class NewEmployeePageModule { }
