import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { Page } from '../../../shared/models/page';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent implements OnInit {
  @ViewChild('HolidayEditCell', { static: true }) editCell: TemplateRef<any>;

  dataSource: MatTableDataSource<any>;
 columns: any[] = [];
  rows = new Array<any>();
  page = new Page();
  cache: any = {};
  ColumnMode = ColumnMode;

  constructor(private _adminService: AdminService, private _datePipe: DatePipe) {
    this.page.pageNumber = 0;
  }

  ngOnInit() {
    this.columns = [
      { name: 'Holiday', prop: 'name' },
      { name: 'Date', prop: 'date', pipe: this.datePipe()},
      { name: 'Rate', prop: 'rate' },
      { name: 'Year', prop: 'year'},
     ];
    this.columns.push({ name: '', cellTemplate: this.editCell, width: '50px'});
  }
  datePipe() {
      return {transform: (value) => this._datePipe.transform(value, 'MM/dd/yyyy')};
  }
  setPage(pageInfo) {
    console.log(pageInfo);
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize === 0 ? 11 : pageInfo.pageSize;

    if (this.cache[this.page.pageNumber]) { return; }
    this._adminService.getHolidays(this.page).subscribe((pagedData: any) => {
      this.page = {
        size: pagedData.limit,
        totalElements: pagedData.totalDocs,
        totalPages: 1,
        pageNumber: pagedData.page - 1
      };

      // calc start
      const start = this.page.pageNumber * this.page.size;

      // copy rows
      const rows = [...this.rows];

      // insert rows into new position
      rows.splice(start, 0, ...pagedData.docs);

      // set rows to our new rows
      this.rows = rows;

      // add flag for results
      this.cache[this.page.pageNumber] = true;
    });
  }
  editRow(row) {
    console.log(row);
  }
  populateTable() {}
}
