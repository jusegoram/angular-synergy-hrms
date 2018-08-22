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
import { ClientComponent } from './employee/client/client.component';
import { WorkpatternComponent } from './employee/workpattern/workpattern.component';
import { PositionComponent } from './employee/position/position.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialSharedModule,
    FormsModule,
    HttpModule,
  ],
  declarations: [UserPermissionComponent, EmployeeComponent, ContentComponent, ClientComponent, WorkpatternComponent, PositionComponent],
  providers: [AdminService]
})
export class AdminModule { }
