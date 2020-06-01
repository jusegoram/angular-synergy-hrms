import { Component } from '@angular/core';
import { environment } from '@synergy/environments/environment';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss'],
})
export class UploadPageComponent {
  api = environment.apiUrl;
  selected = '/upload';
  URL = this.api + '/employee/payroll/upload';

  public uploader: FileUploader = new FileUploader({
    allowedMimeType: ['text/csv'],
    url: this.URL,
    isHTML5: true,
  });
}
