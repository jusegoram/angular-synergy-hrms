import { MatTableDataSource, PageEvent } from '@angular/material';
import { AdminService } from './../../admin.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recent-activities',
  templateUrl: './recent-activities.component.html',
  styleUrls: ['./recent-activities.component.scss']
})
export class RecentActivitiesComponent implements OnInit {
  logsDatasource: any;
  uploadsDatasource: any;

  logsTableColumns = ['user', 'method', 'apiPath', 'ip', 'date'];
  uploadsTableColumns = ['user', 'apiPath', 'fileName', 'fileId', 'date'];

  logsPage = 0;
  logsLength = 0;
  logsLimit = 5;
  logsPageSizeOptions: number[] = [5, 10, 25, 100];

  uploadsPage = 0;
  uploadsLength = 0;
  uploadsLimit=  5;
  uploadsPageSizeOptions: number[] = [5, 10, 25, 100];



  constructor(private _adminService: AdminService) { }

  ngOnInit() {
    this.populateLogs();
    this.populateUploads();
  }

  setLogsPageSizeOptions(setPageSizeOptionsInput: string) {
    this.logsPageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  setUploadsPageSizeOptions(setPageSizeOptionsInput: string) {
    this.uploadsPageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  populateUploads(){
    const opts = {
      _id: 'all',
      page: this.uploadsPage + 1,
      limit: this.uploadsLimit,
    }

    this._adminService.getUploads(opts).subscribe((result: any) => {
      this.uploadsPage = result.page;
      this.uploadsLimit = result.limit;
      this.uploadsLength = result.totalDocs;
      this.uploadsDatasource = new MatTableDataSource(result.docs);
    })
  }

  populateLogs(){
    const opts = {
      _id: 'all',
      page: this.logsPage +1 ,
      limit: this.logsLimit,
    }
    this._adminService.getLogs(opts).subscribe((result: any) => {
      this.logsPage = result.page;
      this.logsLimit = result.limit;
      this.logsLength = result.totalDocs;
      this.logsDatasource = new MatTableDataSource(result.docs);
    })
  }



  onLogsPageEvent(e: PageEvent) {
    const opts = {
      _id: 'all',
      page: e.pageIndex + 1,
      limit: e.pageSize,
    }
    this._adminService.getLogs(opts).subscribe((result: any) => {
      this.logsPage = result.page;
      this.logsLimit = result.limit;
      this.logsLength = result.totalDocs;
      this.logsDatasource = new MatTableDataSource(result.docs);
    })
  }


  onUploadsPageEvent(e: PageEvent) {
    const opts = {
      _id: 'all',
      page: e.pageIndex + 1,
      limit: e.pageSize,
    }
    this._adminService.getUploads(opts).subscribe((result: any) => {
      this.uploadsPage = result.page;
      this.uploadsLimit = result.limit;
      this.uploadsLength = result.totalDocs;
      this.uploadsDatasource = new MatTableDataSource(result.docs);
    })
  }

  rollbackUpload(){

  }

  logsDetail(){

  }
}
