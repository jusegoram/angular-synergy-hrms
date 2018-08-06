import { Component, OnInit } from '@angular/core';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  selected = '/upload';
  URL = environment.siteUri + '/api/v1/employee/payroll/upload';

  public uploader: FileUploader = new FileUploader({
    allowedMimeType: ['text/csv'],
    url: this.URL,
    isHTML5: true
  });
}
