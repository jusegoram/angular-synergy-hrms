import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationOptions } from '@synergy-app/shared/models';

@Component({
  selector: 'app-recent-logs-table',
  templateUrl: './recent-logs-table.component.html',
  styleUrls: ['./recent-logs-table.component.scss']
})
export class RecentLogsTableComponent implements OnInit {
  @Input() logsDatasource = new MatTableDataSource();
  @Input() logsPaginationOptions: PaginationOptions;
  @Output() onPaginationOptionsChange = new EventEmitter();
  logsTableColumns = ['user', 'method', 'apiPath', 'ip', 'date'];

  constructor() { }

  ngOnInit(): void {
    this.onPaginationOptionsChange.emit({
      _id: 'all',
      page: this.logsPaginationOptions.pageIndex + 1,
      limit: this.logsPaginationOptions.limit
    });
  }

  onLogsPageEvent(e: PageEvent) {
    const opts = {
      _id: 'all',
      page: e.pageIndex + 1,
      limit: e.pageSize,
    };
    this.onPaginationOptionsChange.emit(opts);
  }

}
