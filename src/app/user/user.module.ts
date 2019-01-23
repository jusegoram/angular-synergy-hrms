import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user.routing';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialSharedModule } from '../shared/material.shared.module';
import { CompareValidatorDirective } from './compare-validator.directive';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    HttpClientModule,
    MaterialSharedModule,
    FormsModule

  ],
  declarations: [ProfileComponent, SettingsComponent, CompareValidatorDirective],
  providers: [
    UserService
  ]
})
export class UserModule { }
