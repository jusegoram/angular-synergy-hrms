import {EmployeeService} from '../employee.service';
import {Component} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  uploader: FileUploader;
  hoursUploader: FileUploader;
  dataSource: any;
  response: string;
  displayedColumns: string[] = ['name', 'size', 'progress', 'status', 'action'];
  public selected = {value: '/employee/upload', viewValue: 'Employee Main'};
  api = environment.apiUrl;
  items = [
    {value: '/employee/upload', viewValue: 'Employee Main'},
    {value: '/employee/upload/company', viewValue: 'Employee Company'},
    {value: '/employee/upload/position', viewValue: 'Employee Position'},
    {value: '/employee/upload/shift', viewValue: 'Employee Shift'},
    {value: '/employee/upload/personal', viewValue: 'Employee Personal'},
    {
      value: '/employee/upload/personal/hobbies',
      viewValue: 'Employee Hobbies',
    },
    {value: '/employee/upload/payroll', viewValue: 'Employee Payroll'},
    {value: '/employee/upload/family', viewValue: 'Employee Family'},
    {value: '/employee/upload/education', viewValue: 'Employee Education'},
  ];

  templates = [
    {text: 'Main Information', value: '/employee/template'},
    {text: 'Personal Information', value: '/employee/template/personal'},
    {
      text: 'Hobbies Information',
      value: '/employee/template/personal/hobbies',
    },
    {text: 'Company Information', value: '/employee/template/company'},
    {text: 'Position Information', value: '/employee/template/position'},
    {text: 'Shift Information', value: '/employee/template/shift'},
    {text: 'Payroll Information', value: '/employee/template/payroll'},
    {text: 'Family Information', value: '/employee/template/family'},
    {text: 'Education Information', value: '/employee/template/education'},
  ];
  templateSelected = '';

  auth: any;
  constructor(public snackBar: MatSnackBar, private _employeeService: EmployeeService) {
    this.setUploader();
    this.auth = this._employeeService.getAuth();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  setUploader() {
    const setURL = this.api + this.selected.value;
    this.uploader = new FileUploader({
      url: setURL,
      allowedMimeType: ['text/csv', 'application/vnd.ms-excel'],
      isHTML5: true,
      authTokenHeader: 'Authorization',
      authToken: this._employeeService.tokenGetter(),
    });
    this.refresh();
    this.uploader.onAfterAddingFile = (file) => this.refresh();
    this.uploader.onWhenAddingFileFailed = (item) =>
      this.openSnackBar(
        `Sorry, we are unable to process any other file formats.
     Please upload only CSV files`,
        'Ok'
      );
    this.uploader.onSuccessItem = (res) => {
      if (res) {
        this.refresh();
      }
    };

    this.hoursUploader = new FileUploader({
      url: '/',
      isHTML5: true,
    });
  }

  onSelectChange() {
    this.uploader = null;
    this.setUploader();
  }
  refresh() {
    this.dataSource = new MatTableDataSource(this.uploader.queue);
  }
  getTemplate(template: { text: string; value: string }) {
    this._employeeService.getTemplate(template.value).subscribe(
      (data: BlobPart) => {
        this.openSnackBar('Download started', 'thanks');
        const a = document.createElement('a');
        const blob = new Blob([data], {type: 'text/csv'}),
          url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = template.text + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      (err) => {
        console.error(err);
        this.openSnackBar('Woops! Could not start download', 'Try again');
      }
    );
  }
}
