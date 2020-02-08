import { SessionService } from './../../session/session.service';
import { EmployeeService } from './../employee.service';
///<reference path="../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
// const URL = '/api/';
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';



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
    {value: '/api/v1/employee/upload/shift', viewValue: 'Employee Shift'},
    {value: '/api/v1/employee/upload/personal', viewValue: 'Employee Personal'},
    {value: '/api/v1/employee/upload/personal/hobbies', viewValue: 'Employee Hobbies'},
    {value: '/api/v1/employee/upload/payroll', viewValue: 'Employee Payroll'},
    {value: '/api/v1/employee/upload/family', viewValue: 'Employee Family'},
    {value: '/api/v1/employee/upload/education', viewValue: 'Employee Education'}
  ];

  templates = [
    {text: 'Main Information', value: '/api/v1/employee/template'},
    {text: 'Personal Information', value: '/api/v1/employee/template/personal'},
    {text: 'Hobbies Information', value: '/api/v1/employee/template/personal/hobbies'},
    {text: 'Company Information', value: '/api/v1/employee/template/company'},
    {text: 'Position Information', value: '/api/v1/employee/template/position'},
    {text: 'Shift Information', value: '/api/v1/employee/template/shift'},
    {text: 'Payroll Information', value: '/api/v1/employee/template/payroll'},
    {text: 'Family Information', value: '/api/v1/employee/template/family'},
    {text: 'Education Information', value: '/api/v1/employee/template/education'},
  ];
  templateSelected = '';
  // public uploader: FileUploader = new FileUploader({
  //   allowedMimeType: ['text/csv'],
  //   url: this.URL,
  //   isHTML5: true
  // });
  auth: any;
  constructor (public snackBar: MatSnackBar, private _employeeService: EmployeeService) {
    this.setUploader();
    this.auth = this._employeeService.getAuth();
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
      authTokenHeader: "Authorization",
      authToken: this._employeeService.tokenGetter(),
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
    this.uploader = null;
    this.setUploader();
  }
  refresh() {
    this.dataSource = new MatTableDataSource(this.uploader.queue);
  }
  getTemplate(template){
    this._employeeService.getTemplate(template.value).subscribe((data:BlobPart) => {
      this.openSnackBar('Download started', 'thanks');
      var a = document.createElement('a');
      var blob = new Blob([data], {type: 'text/csv' }),
      url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = template.text +".csv";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }, err => {
      console.error(err);
      this.openSnackBar('Woops! Could not start download','Try again');
    })
  }
}
