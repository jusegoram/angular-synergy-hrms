import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
// const URL = '/api/';
const URL = 'https://blink-test.herokuapp.com/upload';

@Component({
  selector: 'app-form-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  public employeeUploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });

  public educationUploader: FileUploader = new FileUploader({
    url: URL + '/education',
    isHTML5: true
  });

  public familyUploader: FileUploader = new FileUploader({
    url: URL + '/family',
    isHTML5: true
  });


  public payrollUploader: FileUploader = new FileUploader({
    url: URL + '/payroll',
    isHTML5: true
  });

  public personalUploader: FileUploader = new FileUploader({
    url: URL + '/personal',
    isHTML5: true
  });

  public positionUploader: FileUploader = new FileUploader({
    url: URL + '/position',
    isHTML5: true
  });
}
