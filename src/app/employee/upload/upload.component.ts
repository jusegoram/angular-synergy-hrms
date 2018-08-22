///<reference path="../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
// const URL = '/api/';
import { environment } from '../../../environments/environment';




@Component({
  selector: 'app-form-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;

   selected = '/upload';
   URL = environment.siteUri + this.selected;
   // http://localhost:3000/upload
  items = [
    {value: '/api/v1/employee/upload', viewValue: 'Employee Main'},
    {value: '/api/v1/employee/upload/company', viewValue: 'Employee Company'},
    {value: '/api/v1/employee/upload/position', viewValue: 'Employee Position'},
    {value: '/api/v1/employee/upload/shift', viewValue: 'Employee Shift(not working)'},
    {value: '/api/v1/employee/upload/personal', viewValue: 'Employee Personal'},
    {value: '/api/v1/employee/upload/payroll', viewValue: 'Employee Payroll'},
    {value: '/api/v1/employee/upload/family', viewValue: 'Employee Family'},
    {value: '/api/v1/employee/upload/education', viewValue: 'Employee Education'}
  ];


  // public uploader: FileUploader = new FileUploader({
  //   allowedMimeType: ['text/csv'],
  //   url: this.URL,
  //   isHTML5: true
  // });
  constructor () {
    this.uploader = new FileUploader({
      url: this.URL,
      allowedMimeType: ['text/csv'],
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });

    this.response = '';

    this.uploader.response.subscribe( res => this.response = res );
  }
   onSelectChange() {
    this.URL = environment.siteUri + this.selected;
    this.uploader = new FileUploader({
      url: this.URL,
      allowedMimeType: ['text/csv'],
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
    this.uploader.onCompleteItem = () => {

    };
  }
}
