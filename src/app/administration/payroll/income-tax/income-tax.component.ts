import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {AdminService} from '../../admin.service';
import {Page} from '../../../shared/models/page';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-income-tax',
  templateUrl: './income-tax.component.html',
  styleUrls: ['./income-tax.component.scss']
})
export class IncomeTaxComponent implements OnInit {
  @ViewChild('IncomeTaxEditCell', { static: true }) editCell: TemplateRef<any>;

  dataSource: MatTableDataSource<any>;
 columns: any[] = [];
  rows = new Array<any>();
  page = new Page();
  cache: any = {};
  ColumnMode = ColumnMode;

  constructor(private _adminService: AdminService,  private currencyPipe: CurrencyPipe) {
    this.page.pageNumber = 0;
  }

  ngOnInit() {
    this.columns = [
      { name: 'EARNINGS FROM', prop: 'fromAmount', pipe: this.currencyPipe},
      { name: 'TO', prop: 'toAmount' , pipe: this.currencyPipe},
      { name: 'TAX', prop: 'taxAmount' , pipe: this.currencyPipe}];
    this.columns.push({ name: '', cellTemplate: this.editCell, width: '50px'});
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize === 0 ? 11 : pageInfo.pageSize;

  //  if (this.cache[this.page.pageNumber]) { return; }
    this._adminService.getIncomeTax(this.page).subscribe((pagedData: any) => {
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
