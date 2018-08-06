///<reference path="../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
// const URL = '/api/';
import { environment } from '../../../environments/environment';




@Component({
  selector: 'app-form-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

   selected = '/upload';
   URL = environment.siteUri + this.selected;
   // http://localhost:3000/upload
  items = [
    {value: '/api/v1/employee/upload', viewValue: 'Employee Main'},
    {value: '/api/v1/employee/upload/position', viewValue: 'Employee Position'},
    {value: '/api/v1/employee/upload/personal', viewValue: 'Employee Personal'},
    {value: '/api/v1/employee/upload/payroll', viewValue: 'Employee Payroll'},
    {value: '/api/v1/employee/upload/family', viewValue: 'Employee Family'},
    {value: '/api/v1/employee/upload/education', viewValue: 'Employee Education'}
  ];
  public uploader: FileUploader = new FileUploader({
    allowedMimeType: ['text/csv'],
    url: this.URL,
    isHTML5: true
  });

   onSelectChange() {
    this.URL = environment.siteUri + this.selected;
    this.uploader = new FileUploader({
      allowedMimeType: ['text/csv'],
      url: this.URL,
      isHTML5: true
    });
    this.uploader.onCompleteItem = () => {

    };
  }
}
