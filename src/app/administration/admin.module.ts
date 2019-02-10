import { MaterialSharedModule } from './../shared/material.shared.module';
import { AdminRoutingModule } from './admin.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { EmployeeComponent } from './employee/employee.component';
import { ContentComponent } from './content/content.component';
import { FormsModule } from '@angular/forms';
import { AdminService } from './services/admin.services';
import { ClientComponent } from './employee/client/client.component';
import { WorkpatternComponent } from './employee/workpattern/workpattern.component';
import { PositionComponent } from './employee/position/position.component';
import { DashboardComponent } from './employee/dashboard/dashboard.component';
import { NewDialogComponent } from './employee/workpattern/new-dialog/new-dialog.component';
import { EditDialogComponent } from './employee/workpattern/edit-dialog/edit-dialog.component';
import { EditPositionDialogComponent } from './employee/position/edit-position-dialog/edit-position-dialog.component';
import { CreateDepartmentDialogComponent } from './employee/position/create-department-dialog/create-department-dialog.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../token-interceptor.service';
import { AuthenticationService } from '../authentication.service';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialSharedModule,
    FormsModule,
    HttpClientModule,
  ],
  declarations: [
    UserPermissionComponent,
    EmployeeComponent,
    ContentComponent,
    ClientComponent,
    WorkpatternComponent,
    PositionComponent,
    DashboardComponent,
    NewDialogComponent,
    EditDialogComponent,
    EditPositionDialogComponent,
    CreateDepartmentDialogComponent,
  ],
  providers: [AdminService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationService,
      multi: true
    }],
  entryComponents: [
    NewDialogComponent,
    EditDialogComponent,
    EditPositionDialogComponent,
    CreateDepartmentDialogComponent,
  ]
})
export class AdminModule { }
