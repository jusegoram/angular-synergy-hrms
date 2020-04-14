import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'shared-on-error-alert',
  templateUrl: './on-error-alert.component.html',
  styleUrls: ['./on-error-alert.component.css']
})
export class OnErrorAlertComponent implements OnInit {
  @ViewChild('errorSwal', { static: false }) swal: SwalComponent;
  // tslint:disable-next-line:no-input-rename
  @Input('message') text;
  constructor() { }

  ngOnInit(): void {
  }
  public fire() {
    return this.swal.fire().then(() => {});
  }
}
