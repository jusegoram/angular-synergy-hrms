import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '@synergy/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { OperationsService } from '@synergy-app/core/services/operations.service';
import { OnErrorAlertComponent } from '@synergy-app/shared/modals/on-error-alert/on-error-alert.component';
import { OnSuccessAlertComponent } from '@synergy-app/shared/modals/on-success-alert/on-success-alert.component';
import { UploadService } from './services/upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cloud-upload',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss'],
})
export class UploadPageComponent implements OnInit {
  @ViewChild('errorAlert', {static: false})
  errorAlert: OnErrorAlertComponent;
  @ViewChild('successAlert', {static: false})
  successAlert: OnSuccessAlertComponent;
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
    value: '',
    viewValue: '',
  };
  items = [
    {
      value: '/operations/uploads/shift',
      viewValue: 'SHIFT',
      swal: ['WAIT', 'Please double check the file you will upload to avoid introducing errors ', 'warning'],
    },
    {
      value: '/operations/uploads/hours',
      viewValue: 'HOURS',
      swal: ['DON\'T FORGET THE SHIFT', 'If you haven\'t, please upload the shift first', 'warning'],
    },
    {
      value: '/operations/uploads/kpi',
      viewValue: 'KPI',
      swal: ['WAIT', 'Please double check the file you will upload to avoid introducing errors ', 'warning'],
    },
  ];

  templates = [
    {
      value: '/operations/templates/shifts',
      viewValue: 'Shift Template',
    },
    {
      value: '/operations/templates/hours',
      viewValue: 'Hours Template',
    },
    {value: '/operations/templates/kpi', viewValue: 'KPI Template'},
  ];
  templateSelected = '';
  constructor(private _service: OperationsService, private _uploadService: UploadService) {
    this.auth = this._service.getDecodedToken().rights;
  }
  ngOnInit(): void {
  }
  onSelectChange() {
    this.setUploader();
  }
  setUploader() {
    this.uploader = this._uploadService.uploaderFactory( this.api + this.selected.value);
    this.refresh();
    this.uploader.onAfterAddingFile = (file) => this.refresh();
    this.uploader.onWhenAddingFileFailed = (item) => {
      Swal.fire('WRONG FILE', 'Only CSV files are allowed', 'error');
      this.refresh();
    };
    this.uploader.onSuccessItem = (res) => this.refresh();
    this.uploader.onErrorItem = (item, res) => {
      this.refresh();
      const error = JSON.parse(res);
      Swal.fire('UPLOAD ERROR', error.message , 'error');
    };
  }
  refresh() {
    this.dataSource = new MatTableDataSource(this.uploader.queue);
  }

  getTemplate(template) {
    this._service.getTemplate(template.value).subscribe(
      (data: BlobPart) => {
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
        this.errorAlert.fire();
      }
    );
  }

  clearErrorTable() {
    this.errorDataSource = null;
  }
}
