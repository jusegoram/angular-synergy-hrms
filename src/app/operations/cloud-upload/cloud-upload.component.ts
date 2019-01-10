import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { MatSnackBar, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-cloud-upload',
  templateUrl: './cloud-upload.component.html',
  styleUrls: ['./cloud-upload.component.scss']
})
export class CloudUploadComponent {
  uploader: FileUploader;
  hoursUploader: FileUploader;
  dataSource: any;
  hoursDataSource: any;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  displayedColumns: string[] = ['name', 'size', 'progress', 'status', 'action'];
  public selected = {value: '/api/v1/employee/upload/hours', viewValue: 'Employee Hours'};
  URL = environment.siteUri;
   // http://localhost:3000/upload
  items = [
    {value: '/api/v1/employee/upload/hours', viewValue: 'Employee Hours'},
  ];

  templates = [
    {text: 'Hours Information', value: '/api/v1/employee/template/hours'},

  ];
  templateSelected = '';
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
