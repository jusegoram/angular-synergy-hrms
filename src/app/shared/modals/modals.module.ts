import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { OnDeleteAlertComponent } from './on-delete-alert/on-delete-alert.component';
import { OnErrorAlertComponent } from './on-error-alert/on-error-alert.component';
import { OnSuccessAlertComponent } from './on-success-alert/on-success-alert.component';
import { GenerateLeaveModalComponent } from './generate-leave-modal/generate-leave-modal.component';
import { FormsModule } from '@angular/forms';
import { MaterialSharedModule } from '../material.shared.module';
import { PdfViewerComponent } from '@synergy-app/shared/modals/pdf-viewer/pdf-viewer.component';

export function provideSwal() {
  return import('sweetalert2/src/sweetalert2.js'); // instead of import('sweetalert2')
}
@NgModule({
  declarations: [
    OnDeleteAlertComponent,
    OnErrorAlertComponent,
    OnSuccessAlertComponent,
    GenerateLeaveModalComponent,
    PdfViewerComponent,
  ],
  imports: [
    CommonModule,
    SweetAlert2Module.forRoot({provideSwal}),
    FormsModule,
    MaterialSharedModule,
  ],
  exports: [
    OnDeleteAlertComponent,
    OnErrorAlertComponent,
    OnSuccessAlertComponent,
    GenerateLeaveModalComponent,
    PdfViewerComponent
  ],
  entryComponents: [GenerateLeaveModalComponent, PdfViewerComponent],
})
export class ModalsModule {
  static forRoot() {
    return {
      ngModule: ModalsModule,
      providers: [],
    };
  }
}
