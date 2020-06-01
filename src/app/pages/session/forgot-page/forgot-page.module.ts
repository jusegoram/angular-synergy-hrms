import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPageRoutingModule } from './forgot-page-routing.module';
import { ForgotPageComponent } from './forgot-page.component';
import { MaterialSharedModule } from '@synergy-app/shared';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ForgotPageComponent],
  imports: [CommonModule, ForgotPageRoutingModule, MaterialSharedModule, FormsModule],
})
export class ForgotPageModule {}
