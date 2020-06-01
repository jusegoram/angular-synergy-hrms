import { EmployeeService } from '@synergy-app/core/services';
import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '@synergy/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-upload',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss'],
})
export class UploadPageComponent {
  uploader: FileUploader;
  hoursUploader: FileUploader;
  dataSource: any;
  response: string;
  displayedColumns: string[] = ['name', 'size', 'progress', 'status', 'action'];
  public selected = {value: '/uploads/employee', viewValue: 'Employee Main'};
  api = environment.apiUrl;
  items = [
    {value: '/uploads/employee', viewValue: 'Employee Main'},
    {value: '/uploads/employee/company', viewValue: 'Employee Company'},
    {value: '/uploads/employee/manager', viewValue: 'Employee Managers'},
    {value: '/uploads/employee/position', viewValue: 'Employee Position'},
    {value: '/uploads/employee/personal', viewValue: 'Employee Personal'},
    {value: '/uploads/employee/payroll', viewValue: 'Employee Payroll'},
    {value: '/uploads/employee/family', viewValue: 'Employee Family'},
   // {value: '/uploads/employee/education', viewValue: 'Employee Education'},
  ];

  templates = [
    {text: 'Main Information', value: '/uploads/employee/templates/main'},
    {text: 'Personal Information', value: '/uploads/employee/templates/personal'},
    {text: 'Company Information', value: '/uploads/employee/templates/company'},
    {text: 'Company Managers Information ', value: '/uploads/employee/templates/manager'},
    {text: 'Position Information', value: '/uploads/employee/templates/position'},
    {text: 'Payroll Information', value: '/uploads/employee/templates/payroll'},
    {text: 'Family Information', value: '/uploads/employee/templates/family'},
 //   {text: 'Education Information', value: '/uploads/employee/templates/education'},
  ];
  templateSelected = '';

  auth: any;
  constructor(public snackBar: MatSnackBar, private _employeeService: EmployeeService) {
    this.setUploader();
    this.auth = this._employeeService.getAuth();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
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
    this.uploader.onErrorItem = (item, res) => {
      const error = JSON.parse(res);
      this.openSnackBar(
        error.message || 'INTERNAL ERROR - CONTACT SYNERGY TEAM',
        'DISMISS'
      );    };
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
