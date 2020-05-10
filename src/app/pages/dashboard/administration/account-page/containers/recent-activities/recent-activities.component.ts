import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '@synergy-app/core/services';
import { Component, OnInit } from '@angular/core';
import { DATA_TABLE } from '@synergy/environments/enviroment.common';
import { PaginationOptions } from '@synergy-app/shared/models';

@Component({
  selector: 'app-recent-activities',
  templateUrl: './recent-activities.component.html',
  styleUrls: ['./recent-activities.component.scss'],
})
export class RecentActivitiesComponent implements OnInit {
  logsDatasource: any;
  uploadsDatasource: any;

  logsPaginationOptions: PaginationOptions;
  uploadsPaginationOptions: PaginationOptions;

  logsTableColumns = ['user', 'method', 'apiPath', 'ip', 'date'];
  uploadsTableColumns = ['user', 'apiPath', 'fileName', 'fileId', 'date'];

  constructor(private _adminService: AdminService) {}

  ngOnInit() {
    this.logsPaginationOptions = {
      pageIndex: 0,
      length: 0,
      limit: 5,
      pageSizeOptions: DATA_TABLE.PAGINATION.DEFAULT_PAGE_SIZES,
    };
    this.uploadsPaginationOptions = { ...this.logsPaginationOptions };
  }

  fetchLogs(opts) {
    this._adminService.getLogs(opts).subscribe((result: any) => {
      const { page, limit, totalDocs } = result;
      this.logsPaginationOptions.pageIndex = page;
      this.logsPaginationOptions.limit = limit;
      this.logsPaginationOptions.length = totalDocs;
      this.logsDatasource = new MatTableDataSource(result.docs);
    });
  }

  fetchUploads(opts) {
    this._adminService.getUploads(opts).subscribe((result: any) => {
      const { page, limit, totalDocs } = result;
      this.uploadsPaginationOptions.pageIndex = page;
      this.uploadsPaginationOptions.limit = limit;
      this.uploadsPaginationOptions.length = totalDocs;
      this.uploadsDatasource = new MatTableDataSource(result.docs);
    });
  }

  rollbackUpload() {}

  logsDetail() {}
}
