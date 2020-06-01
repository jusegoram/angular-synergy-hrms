import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '@synergy-app/core/services';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Page } from '@synergy-app/shared/models';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-social-security',
  templateUrl: './social-security.component.html',
  styleUrls: ['./social-security.component.scss'],
})
export class SocialSecurityComponent implements OnInit {
  @ViewChild('editCell', {static: true}) editCell: TemplateRef<any>;

  dataSource: MatTableDataSource<any>;
  columns: any[] = [];
  rows = new Array<any>();
  page = new Page();
  cache: any = {};
  ColumnMode = ColumnMode;

  constructor(private _adminService: AdminService, private currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    this.columns = [
      {name: 'EARNINGS FROM', prop: 'fromEarnings', pipe: this.currencyPipe},
      {name: 'TO', prop: 'toEarnings', pipe: this.currencyPipe},
      {
        name: 'INSURABLE EARNINGS',
        prop: 'weeklyInsurableEarnings',
        pipe: this.currencyPipe,
      },
      {name: 'RCC', prop: 'employerContribution', pipe: this.currencyPipe},
      {name: 'EMP', prop: 'employeeContribution', pipe: this.currencyPipe},
      {name: 'TOTAL', prop: 'totalContribution', pipe: this.currencyPipe},
    ];
    this.columns.push({name: '', cellTemplate: this.editCell, width: '50px'});
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;

    if (this.cache[this.page.pageNumber]) {
      return;
    }
    this._adminService.getSoSec(this.page).subscribe((pagedData: any) => {
      this.page = {
        size: pagedData.limit,
        totalElements: pagedData.totalDocs,
        totalPages: 1,
        pageNumber: pagedData.page - 1,
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
