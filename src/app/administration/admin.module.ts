import { MaterialSharedModule } from './../shared/material.shared.module';
import { AdminRoutingModule } from './admin.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { EmployeeComponent } from './employee/employee.component';
import { ContentComponent } from './content/content.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AdminService } from './services/admin.services';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialSharedModule,
    FormsModule,
    HttpModule,
  ],
  declarations: [UserPermissionComponent, EmployeeComponent, ContentComponent],
  providers: [AdminService]
})
export class AdminModule { }
