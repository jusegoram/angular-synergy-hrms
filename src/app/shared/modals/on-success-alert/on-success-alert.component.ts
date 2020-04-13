import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'shared-on-success-alert',
  templateUrl: './on-success-alert.component.html'
})
export class OnSuccessAlertComponent  {
  @ViewChild('successSwal', { static: false }) swal: SwalComponent;

  @Input('message') message;
  constructor() { }

  public fire() {
    this.swal.fire().then(() => {});
  }
}
