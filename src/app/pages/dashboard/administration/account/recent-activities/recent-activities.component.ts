import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from './../../admin.service';
import { Component, OnInit } from '@angular/core';
import { DATA_TABLE } from '@synergy/environments/enviroment.common';

@Component({
  selector: 'app-recent-activities',
  templateUrl: './recent-activities.component.html',
  styleUrls: ['./recent-activities.component.scss'],
})
export class RecentActivitiesComponent implements OnInit {
  logsDatasource: any;
  uploadsDatasource: any;

  logsTableColumns = ['user', 'method', 'apiPath', 'ip', 'date'];
  uploadsTableColumns = ['user', 'apiPath', 'fileName', 'fileId', 'date'];

  logsPage = 0;
  logsLength = 0;
  logsLimit = 5;
  logsPageSizeOptions: number[] = DATA_TABLE.PAGINATION.DEFAULT_PAGE_SIZES;

  uploadsPage = 0;
  uploadsLength = 0;
  uploadsLimit = 5;
  uploadsPageSizeOptions: number[] = DATA_TABLE.PAGINATION.DEFAULT_PAGE_SIZES;

  constructor(private _adminService: AdminService) {}

  ngOnInit() {
    this.populateLogs();
    this.populateUploads();
  }

  setLogsPageSizeOptions(setPageSizeOptionsInput: string) {
    this.logsPageSizeOptions = setPageSizeOptionsInput.split(',').map((str) => +str);
  }

  setUploadsPageSizeOptions(setPageSizeOptionsInput: string) {
    this.uploadsPageSizeOptions = setPageSizeOptionsInput.split(',').map((str) => +str);
  }

  populateUploads() {
    const opts = {
      _id: 'all',
      page: this.uploadsPage + 1,
      limit: this.uploadsLimit,
    };

    this.getUploads(opts);
  }

  populateLogs() {
    const opts = {
      _id: 'all',
      page: this.logsPage + 1,
      limit: this.logsLimit,
    };
    this.getLogs(opts);
  }

  onLogsPageEvent(e: PageEvent) {
    const opts = {
      _id: 'all',
      page: e.pageIndex + 1,
      limit: e.pageSize,
    };
    this.getLogs(opts);
  }

  getLogs(opts) {
    this._adminService.getLogs(opts).subscribe((result: any) => {
      this.logsPage = result.page;
      this.logsLimit = result.limit;
      this.logsLength = result.totalDocs;
      this.logsDatasource = new MatTableDataSource(result.docs);
    });
  }

  onUploadsPageEvent(e: PageEvent) {
    const opts = {
      _id: 'all',
      page: e.pageIndex + 1,
      limit: e.pageSize,
    };
    this.getUploads(opts);
  }
  getUploads(opts) {
    this._adminService.getUploads(opts).subscribe((result: any) => {
      this.uploadsPage = result.page;
      this.uploadsLimit = result.limit;
      this.uploadsLength = result.totalDocs;
      this.uploadsDatasource = new MatTableDataSource(result.docs);
    });
  }
  rollbackUpload() {}

  logsDetail() {}
}
