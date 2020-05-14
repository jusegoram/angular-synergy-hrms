import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentPageRoutingModule } from './content-page-routing.module';
import { MenuService } from '@synergy-app/shared/services';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { ContentPageComponent } from './content-page.component';
import { FormsModule } from '@angular/forms';
import { MenuSelectorComponent } from './components/menu-selector/menu-selector.component';
import { SubMenuItemsEditorComponent } from './components/sub-menu-items-editor/sub-menu-items-editor.component';


@NgModule({
  declarations: [ContentPageComponent, MenuSelectorComponent, SubMenuItemsEditorComponent],
  imports: [
    CommonModule,
    ContentPageRoutingModule,
    MaterialSharedModule,
    FormsModule
  ],
  providers: [MenuService]
})
export class ContentPageModule { }
