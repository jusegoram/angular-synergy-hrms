import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

// const URL = '/api/';
const URL = 'http://localhost:3000/upload';

@Component({
  selector: 'app-form-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  public uploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
}
