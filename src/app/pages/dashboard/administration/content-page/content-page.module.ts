import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentPageRoutingModule } from './content-page-routing.module';
import { MenuService } from '@synergy-app/shared/services';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { ContentPageComponent } from './content-page.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ContentPageComponent],
  imports: [
    CommonModule,
    ContentPageRoutingModule,
    MaterialSharedModule,
    FormsModule
  ],
  providers: [MenuService]
})
export class ContentPageModule { }
