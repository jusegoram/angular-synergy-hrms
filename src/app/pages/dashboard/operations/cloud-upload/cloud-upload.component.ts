import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '@synergy/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { OperationsService } from '../operations.service';

@Component({
  selector: 'app-cloud-upload',
  templateUrl: './cloud-upload.component.html',
  styleUrls: ['./cloud-upload.component.scss'],
})
export class CloudUploadComponent {
  api = environment.apiUrl;
  auth: any;
  uploader: FileUploader;
  hoursUploader: FileUploader;
  dataSource: any;
  errorDataSource: any;
  response: string;
  errorTableColumns: string[] = ['employeeId', 'dialerId', 'date', 'systemHours', 'tosHours', 'timeIn'];
  displayedColumns: string[] = ['name', 'size', 'progress', 'status', 'action'];
  public selected = {
    value: '/employee/upload/hours',
    viewValue: 'Employee Hours',
  };
  items = [
    {
      value: '/operations/upload/hours',
      viewValue: 'Hours',
      swal: ['DON\'T FORGET THE SHIFT', 'If you haven\'t, please upload the shift first', 'warning'],
    },
    {
      value: '/operations/upload/kpi',
      viewValue: 'KPI\'s',
      swal: ['WAIT', 'Please double check the file you will upload to avoid introducing errors ', 'warning'],
    },
  ];

  templates = [
    {
      value: '/operations/hourTemplate',
      viewValue: 'Hours Template',
    },
    {value: '/operations/kpiTemplate', viewValue: 'KPI Template'},
  ];
  templateSelected = '';
  // public uploader: FileUploader = new FileUploader({
  //   allowedMimeType: ['text/csv'],
  //   url: this.URL,
  //   isHTML5: true
  // });
  constructor(public snackBar: MatSnackBar, private _operationsService: OperationsService) {
    this.auth = this._operationsService.getDecodedToken().rights;
    this.setUploader();
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
      authToken: this._operationsService.tokenGetter(),
    });
    this.refresh();
    this.uploader.onAfterAddingFile = () => this.refresh();
    this.uploader.onWhenAddingFileFailed = () =>
      this.openSnackBar(
        `Sorry, we are unable to process any other file formats.
     Please upload only CSV files`,
        'Ok'
      );
    this.uploader.onSuccessItem = (res) => {
      if (res) {
        this.refresh();
        this.openSnackBar('Great! the upload was successful', 'Thanks!');
      }
    };
    this.uploader.onErrorItem = (item, res) => {
      const { incorrectHours } = JSON.parse(res);
      if (incorrectHours) {
        this.errorDataSource = new MatTableDataSource(incorrectHours);
      }
      this.openSnackBar(
        `Woops! Remember that all the fields in the template are REQUIRED AND
        There can't be any duplicates records for the same Date.`,
        'Ok, I\'ll try again'
      );
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

  getTemplate(template) {
    this._operationsService.getTemplate(template.value).subscribe(
      (data: BlobPart) => {
        this.openSnackBar('Download started', 'thanks');
        const a = document.createElement('a');
        const blob = new Blob([data], {type: 'text/csv'}),
          url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = template.viewValue + '.csv';
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

  clearErrorTable() {
    this.errorDataSource = null;
  }
}
