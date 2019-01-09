///<reference path="../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
// const URL = '/api/';
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material';
import {MatSnackBar} from '@angular/material';



@Component({
  selector: 'app-form-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  uploader: FileUploader;
  hoursUploader: FileUploader;
  dataSource: any;
  hoursDataSource: any;
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

  templates = [
    {text: 'Main Information', value: URL + '/api/v1/employee/template'},
    {text: 'Personal Information', value: URL + '/api/v1/employee/template/personal'},
    {text: 'Company Information', value: URL + '/api/v1/employee/template/company'},
    {text: 'Position Information', value: URL + '/api/v1/employee/template/position'},
    {text: 'Shift Information(not working)', value: URL + '/api/v1/employee/template/shift'},
    {text: 'Payroll Information', value: URL + '/api/v1/employee/template/payroll'},
    {text: 'Family Information', value: URL + '/api/v1/employee/template/family'},
    {text: 'Education Information', value: URL + '/api/v1/employee/template/education'},
  ];
  templateSelected = '/template';
  // public uploader: FileUploader = new FileUploader({
  //   allowedMimeType: ['text/csv'],
  //   url: this.URL,
  //   isHTML5: true
  // });
  constructor (public snackBar: MatSnackBar) {
    this.setUploader();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

   setUploader() {
     const setURL = this.URL + this.selected.value;
    this.uploader = new FileUploader({
      url: setURL,
      allowedMimeType: ['text/csv', 'application/vnd.ms-excel'],
      isHTML5: true,
    });
    this.refresh();
    this.uploader.onAfterAddingFile = (file) => this.refresh();
    this.uploader.onWhenAddingFileFailed = (item) => this.openSnackBar(`Sorry, we are unable to process any other file formats.
     Please upload only CSV files`, 'Ok');
    this.uploader.onSuccessItem = (res) => {if (res) { this.refresh(); }};

    this.hoursUploader = new FileUploader({
      url: '/',
      isHTML5: true
    });
  }

  onSelectChange() {
    console.log(this.selected.value);
    this.uploader = null;
    this.setUploader();
  }
  refresh() {
    this.dataSource = new MatTableDataSource(this.uploader.queue);
  }
}
