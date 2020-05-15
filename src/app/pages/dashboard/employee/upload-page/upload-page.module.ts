import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { UploadPageRoutingModule } from './upload-page-routing.module';
import { UploadPageComponent } from './upload.component';
import { MaterialSharedModule } from '@synergy-app/shared';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ UploadPageComponent ],
  imports: [
    CommonModule,
    UploadPageRoutingModule,
    MaterialSharedModule,
    FormsModule,
    FileUploadModule
  ]
})
export class UploadPageModule { }
