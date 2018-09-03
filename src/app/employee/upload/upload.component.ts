///<reference path="../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
// const URL = '/api/';
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material';




@Component({
  selector: 'app-form-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  uploader: FileUploader;
  dataSource: any;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  displayedColumns: string[] = ['name', 'size', 'progress', 'status', 'action'];
  public selected = {value: '/api/v1/employee/upload', viewValue: 'Employee Main'};
  URL = environment.siteUri;
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
    this.setUploader();
  }

   setUploader() {
     const setURL = this.URL + this.selected.value;
    this.uploader = new FileUploader({
      url: setURL,
      allowedMimeType: ['text/csv'],
      isHTML5: true,
    });
    this.refresh();
    this.uploader.onAfterAddingFile = (file) => this.refresh();
    this.uploader.onSuccessItem = (res) => {if (res) { this.refresh(); }};
  }

  onSelectChange(){
    console.log(this.selected.value);
    this.uploader = null;
    this.setUploader();
  }
  refresh() {
    console.log(this.selected.value);
    this.dataSource = new MatTableDataSource(this.uploader.queue);
  }
}
