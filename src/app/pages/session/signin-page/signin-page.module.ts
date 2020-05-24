import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninPageRoutingModule } from './signin-page-routing.module';
import { SigninPageComponent } from './signin-page.component';
import { MaterialSharedModule } from '@synergy-app/shared';
import { FormsModule } from '@angular/forms';
import { SynergyLogoComponent } from './components/synergy-logo/synergy-logo.component';
import { LoginFormComponent } from './components/login-form/login-form.component';

@NgModule({
  declarations: [SigninPageComponent, SynergyLogoComponent, LoginFormComponent],
  imports: [CommonModule, SigninPageRoutingModule, MaterialSharedModule, FormsModule],
})
export class SigninPageModule {}
