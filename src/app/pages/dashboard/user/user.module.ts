import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user.routing';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { UserService } from './services/user.service';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { CompareValidatorDirective } from './compare-validator.directive';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, UserRoutingModule, MaterialSharedModule, FormsModule],
  declarations: [ProfileComponent, SettingsComponent, CompareValidatorDirective],
  providers: [
    UserService
  ],
})
export class UserModule {}
