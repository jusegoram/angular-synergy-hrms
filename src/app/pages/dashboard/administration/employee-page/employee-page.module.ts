import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeePageRoutingModule } from './employee-page-routing.module';
import { EmployeePageComponent } from './employee-page.component';
import { ClientComponent } from './containers/client/client.component';
import { WorkpatternComponent } from './containers/workpattern/workpattern.component';
import { PositionComponent } from './containers/position/position.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { NewWorkPatternDialogComponent } from './components/new-work-pattern-dialog/new-work-pattern-dialog.component';
import { EditWorkPatternDayDialogComponent } from './components/edit-work-pattern-day-dialog/edit-work-pattern-day-dialog.component';
import { EditPositionDialogComponent } from './components/edit-position-dialog/edit-position-dialog.component';
import {
  CreateDepartmentDialogComponent
} from './components/create-department-dialog/create-department-dialog.component';
import { SharedModule } from '@synergy-app/shared/shared.module';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { FormsModule } from '@angular/forms';
import { ClientSelectorComponent } from './components/client-selector/client-selector.component';
import { ClientCampaignsEditorComponent } from './components/client-campaigns-editor/client-campaigns-editor.component';

@NgModule({
  declarations: [
    EmployeePageComponent,
    ClientComponent,
    WorkpatternComponent,
    PositionComponent,
    DashboardComponent,
    NewWorkPatternDialogComponent,
    EditWorkPatternDayDialogComponent,
    EditPositionDialogComponent,
    CreateDepartmentDialogComponent,
    ClientSelectorComponent,
    ClientCampaignsEditorComponent,
  ],
  imports: [CommonModule, EmployeePageRoutingModule, MaterialSharedModule, FormsModule, SharedModule],
  entryComponents: [
    NewWorkPatternDialogComponent,
    EditWorkPatternDayDialogComponent,
    EditPositionDialogComponent,
    CreateDepartmentDialogComponent,
  ],
})
export class EmployeePageModule {}
