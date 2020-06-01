import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePageRoutingModule } from './manage-page-routing.module';
import { ManagePageComponent } from './manage-page.component';


@NgModule({
  declarations: [ManagePageComponent],
  imports: [
    CommonModule,
    ManagePageRoutingModule
  ]
})
export class ManagePageModule { }
