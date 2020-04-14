import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user.routing';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { UserService } from './user.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialSharedModule } from '../shared/material.shared.module';
import { CompareValidatorDirective } from './compare-validator.directive';
import { FormsModule } from '@angular/forms';
import { TokenInterceptor } from '../token-interceptor.service';
import { AuthenticationService } from '../authentication.service';

@NgModule({
  imports: [CommonModule, UserRoutingModule, HttpClientModule, MaterialSharedModule, FormsModule],
  declarations: [ProfileComponent, SettingsComponent, CompareValidatorDirective],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationService,
      multi: true,
    },
  ],
})
export class UserModule {}
