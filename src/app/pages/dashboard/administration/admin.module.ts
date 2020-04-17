import { IncomeTaxComponent } from './payroll/income-tax/income-tax.component';
import { HolidaysComponent } from './payroll/holidays/holidays.component';
import { SocialSecurityComponent } from './payroll/social-security/social-security.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { AdminRoutingModule } from './admin.routing';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { AccountComponent } from './account/acount.component';
import { EmployeeComponent } from './employee/employee.component';
import { ContentComponent } from './content/content.component';
import { FormsModule } from '@angular/forms';
import { AdminService } from './services/admin.service';
import { ClientComponent } from './employee/client/client.component';
import { WorkpatternComponent } from './employee/workpattern/workpattern.component';
import { PositionComponent } from './employee/position/position.component';
import { DashboardComponent } from './employee/dashboard/dashboard.component';
import { NewDialogComponent } from './employee/workpattern/new-dialog/new-dialog.component';
import { EditDialogComponent } from './employee/workpattern/edit-dialog/edit-dialog.component';
import { EditPositionDialogComponent } from './employee/position/edit-position-dialog/edit-position-dialog.component';
import { CreateDepartmentDialogComponent } from './employee/position/create-department-dialog/create-department-dialog.component';
import { EditUserDialogComponent } from './account/edit-user-dialog/edit-user-dialog.component';
import { CreateUserComponent } from './account/create-user/create-user.component';
import { RecentActivitiesComponent } from './account/recent-activities/recent-activities.component';
import { PayrollComponent } from './payroll/payroll.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialSharedModule,
    FormsModule,
    NgxDatatableModule,
  ],
  declarations: [
    AccountComponent,
    EmployeeComponent,
    PayrollComponent,
    SocialSecurityComponent,
    HolidaysComponent,
    IncomeTaxComponent,
    ContentComponent,
    ClientComponent,
    WorkpatternComponent,
    PositionComponent,
    DashboardComponent,
    NewDialogComponent,
    EditDialogComponent,
    EditPositionDialogComponent,
    CreateDepartmentDialogComponent,
    EditUserDialogComponent,
    CreateUserComponent,
    RecentActivitiesComponent,
  ],
  providers: [
    AdminService,
    CurrencyPipe,
    DatePipe
  ],
  entryComponents: [
    NewDialogComponent,
    EditDialogComponent,
    EditPositionDialogComponent,
    CreateDepartmentDialogComponent,
    EditUserDialogComponent,
  ],
})
export class AdminModule {}
