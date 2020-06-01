import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { AccountPageRoutingModule } from './account-page-routing.module';
import { AccountPageComponent } from './account-page.component';
import { EditUserDialogComponent } from './containers/edit-user-dialog/edit-user-dialog.component';
import { CreateUserComponent } from './containers/create-user/create-user.component';
import { RecentActivitiesComponent } from './containers/recent-activities/recent-activities.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { FormsModule } from '@angular/forms';
import {
  RecentActivitiesTableComponent
} from './components/recent-activities-table/recent-activities-table.component';

@NgModule({
  declarations: [
    AccountPageComponent,
    EditUserDialogComponent,
    CreateUserComponent,
    RecentActivitiesComponent,
    RecentActivitiesTableComponent
  ],
  imports: [
    CommonModule,
    AccountPageRoutingModule,
    MaterialSharedModule,
    FormsModule
  ],
  providers: [CurrencyPipe, DatePipe],
  entryComponents: [EditUserDialogComponent],
})
export class AccountPageModule {}
