import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { OnDeleteAlertComponent } from './on-delete-alert/on-delete-alert.component';
import { OnErrorAlertComponent } from './on-error-alert/on-error-alert.component';
import { OnSuccessAlertComponent } from './on-success-alert/on-success-alert.component';

export function provideSwal() {
  return import('sweetalert2/src/sweetalert2.js'); // instead of import('sweetalert2')
}
@NgModule({
  declarations: [
    OnDeleteAlertComponent,
    OnErrorAlertComponent,
    OnSuccessAlertComponent,
  ],
  imports: [
    CommonModule,
    SweetAlert2Module.forRoot({provideSwal})
  ],
  exports: [
    OnDeleteAlertComponent,
    OnErrorAlertComponent,
    OnSuccessAlertComponent
  ]
})
export class ModalsModule {
  static forRoot() {
    return {
      ngModule: ModalsModule,
      providers: [],
    };
  }
}
