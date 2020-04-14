import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  api = environment.apiUrl;
  selected = '/upload';
  URL = this.api + '/employee/payroll/upload';

  public uploader: FileUploader = new FileUploader({
    allowedMimeType: ['text/csv'],
    url: this.URL,
    isHTML5: true,
  });
}
