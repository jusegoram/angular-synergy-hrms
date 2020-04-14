import { Component, Input, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'shared-on-success-alert',
  templateUrl: './on-success-alert.component.html'
})
export class OnSuccessAlertComponent  {
  @ViewChild('successSwal', { static: false }) swal: SwalComponent;
  // tslint:disable-next-line:no-input-rename
  @Input('message') text;
  constructor() { }

  public fire() {
    this.swal.fire().then(() => {});
  }
}
