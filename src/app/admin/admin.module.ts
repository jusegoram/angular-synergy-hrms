import { MaterialSharedModule } from './../shared/material.shared.module';
import { AdminRoutingModule } from './admin.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { EmployeeComponent } from './employee/employee.component';
import { ContentComponent } from './content/content.component';
@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialSharedModule
  ],
  declarations: [UserPermissionComponent, EmployeeComponent, ContentComponent]
})
export class AdminModule { }
