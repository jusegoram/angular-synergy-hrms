import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeePageRoutingModule } from './employee-page-routing.module';
import { EmployeePageComponent } from './employee-page.component';
import { ClientComponent } from './client/client.component';
import { WorkpatternComponent } from './workpattern/workpattern.component';
import { PositionComponent } from './position/position.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewDialogComponent } from './workpattern/new-dialog/new-dialog.component';
import { EditDialogComponent } from './workpattern/edit-dialog/edit-dialog.component';
import { EditPositionDialogComponent } from './position/edit-position-dialog/edit-position-dialog.component';
import {
  CreateDepartmentDialogComponent
} from './position/create-department-dialog/create-department-dialog.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EmployeePageComponent,
    ClientComponent,
    WorkpatternComponent,
    PositionComponent,
    DashboardComponent,
    NewDialogComponent,
    EditDialogComponent,
    EditPositionDialogComponent,
    CreateDepartmentDialogComponent,
  ],
  imports: [CommonModule, EmployeePageRoutingModule, MaterialSharedModule, FormsModule],
  entryComponents: [
    NewDialogComponent,
    EditDialogComponent,
    EditPositionDialogComponent,
    CreateDepartmentDialogComponent,
  ],
})
export class EmployeePageModule {}
