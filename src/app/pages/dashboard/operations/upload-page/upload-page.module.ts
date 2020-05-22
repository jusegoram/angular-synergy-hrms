import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadPageRoutingModule } from './upload-page-routing.module';
import { UploadPageComponent } from './upload-page.component';
import { UploadService } from './services/upload.service';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [UploadPageComponent],
  imports: [
    CommonModule,
    UploadPageRoutingModule,
    MaterialSharedModule,
    NgxDatatableModule,
    FileUploadModule,
    FormsModule,
    SharedModule
  ],
  providers: [UploadService]
})
export class UploadPageModule { }
