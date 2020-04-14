import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'shared-on-delete-alert',
  templateUrl: './on-delete-alert.component.html',
  styleUrls: ['./on-delete-alert.component.css']
})
export class OnDeleteAlertComponent implements OnInit {
  @ViewChild('deleteSwal', { static: false }) swal: SwalComponent;
  // tslint:disable-next-line:no-input-rename
  @Input('message') text;
  @Output() confirm = new EventEmitter<any>();
  CANCEL = false;
  DELETED_ITEM;
  constructor() { }

  ngOnInit(): void {
  }
  onConfirm(e) {
    this.confirm.emit(this.DELETED_ITEM);
  }
  onCancel(e) {
    this.confirm.emit(this.CANCEL);
  }
  public fire(deletedItem) {
    this.DELETED_ITEM = deletedItem;
    return this.swal.fire().then(() => {});
  }
}
