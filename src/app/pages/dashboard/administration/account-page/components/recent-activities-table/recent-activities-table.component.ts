import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationOptions } from '@synergy-app/shared/models';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-recent-activities-table',
  templateUrl: './recent-activities-table.component.html',
  styleUrls: ['./recent-activities-table.component.scss'],
})
export class RecentActivitiesTableComponent implements OnInit {
  @Input() title: string;
  @Input() datasource = new MatTableDataSource();
  @Input() paginationOptions: PaginationOptions;
  @Input() tableColumns: string[];
  @Input() isLogsTable = false;
  @Output() onPaginationOptionsChange = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.onPaginationOptionsChange.emit({
      _id: 'all',
      page: this.paginationOptions.pageIndex + 1,
      limit: this.paginationOptions.limit,
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
