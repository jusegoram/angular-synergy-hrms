import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadPageRoutingModule } from './upload-page-routing.module';
import { UploadPageComponent } from './upload-page.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialSharedModule } from '@synergy-app/shared';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [UploadPageComponent],
  imports: [
    CommonModule,
    UploadPageRoutingModule,
    NgxDatatableModule,
    MaterialSharedModule,
    FileUploadModule
  ]
})
export class UploadPageModule { }
