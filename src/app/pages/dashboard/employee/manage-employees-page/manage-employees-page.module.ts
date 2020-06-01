import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageEmployeesPageRoutingModule } from './manage-employees-page-routing.module';
import { ManageEmployeesComponent } from './manage-employees-page.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@synergy-app/shared/shared.module';


@NgModule({
  declarations: [
    ManageEmployeesComponent
  ],
  imports: [
    CommonModule,
    ManageEmployeesPageRoutingModule,
    MaterialSharedModule,
    FormsModule,
    SharedModule
  ]
})
export class ManageEmployeesPageModule { }
