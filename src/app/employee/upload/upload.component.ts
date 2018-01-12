import { Component, OnInit } from '@angular/core';
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
   //http://localhost:3000/upload
  items = [
    {value: '/upload', viewValue: 'Employee Main'},
    {value: '/upload/position', viewValue: 'Employee Position'},
    {value: '/upload/personal', viewValue: 'Employee Personal'},
    {value: '/upload/payroll', viewValue: 'Employee Payroll'},
    {value: '/upload/family', viewValue: 'Employee Family'},
    {value: '/upload/education', viewValue: 'Employee Education'}
  ];
  public uploader: FileUploader = new FileUploader({
    url: this.URL,
    isHTML5: true
  });

   onSelectChange() {
    this.URL = environment.siteUri + this.selected;
    this.uploader = new FileUploader({
      url: this.URL,
      isHTML5: true
    });
    console.log(this.URL);
  }
}
