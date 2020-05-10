import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationOptions } from '@synergy-app/shared/models';

@Component({
  selector: 'app-recent-upload-table',
  templateUrl: './recent-upload-table.component.html',
  styleUrls: ['./recent-upload-table.component.scss']
})
export class RecentUploadTableComponent implements OnInit {

  uploadsTableColumns = ['user', 'apiPath', 'fileName', 'fileId', 'date'];

  @Input() uploadsDatasource = new MatTableDataSource();
  @Input() uploadsPaginationOptions: PaginationOptions;
  @Output() onPaginationOptionsChange = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.onPaginationOptionsChange.emit({
      _id: 'all',
      page: this.uploadsPaginationOptions.pageIndex + 1,
      limit: this.uploadsPaginationOptions.limit
    });
  }

  onUploadsPageEvent(e: PageEvent) {
    const opts = {
      _id: 'all',
      page: e.pageIndex + 1,
      limit: e.pageSize,
    };
    this.onPaginationOptionsChange.emit(opts);
  }

}
