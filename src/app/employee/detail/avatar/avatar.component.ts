import { Component, OnInit, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'avatar-detail',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() employeeId: string;
  @Input() authorization: boolean;
  selected = '/upload/avatars';
   URL = environment.siteUri + this.selected;
  constructor() { }

  public uploader: FileUploader = new FileUploader({
    allowedMimeType:["image/jpeg"],
    url: this.URL,
    isHTML5: true
  });


  ngOnInit() {
  }

}
