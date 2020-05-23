import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { ProfilePageComponent } from './profile-page.component';
import { MaterialSharedModule } from '@synergy-app/shared';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@NgModule({
  declarations: [ProfilePageComponent],
  imports: [CommonModule, ProfilePageRoutingModule, MaterialSharedModule, FormsModule],
  providers: [UserService],
})
export class ProfilePageModule {}
