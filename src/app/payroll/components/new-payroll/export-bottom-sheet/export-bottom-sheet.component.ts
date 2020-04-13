import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef,} from '@angular/material/bottom-sheet';
import * as XLSX from 'xlsx';
import moment from 'moment';

@Component({
  selector: 'app-export-bottom-sheet',
  templateUrl: './export-bottom-sheet.component.html',
  styleUrls: ['./export-bottom-sheet.component.scss'],
})
export class ExportBottomSheetComponent implements OnInit {
  wb: XLSX.WorkBook;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ExportBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}

  ngOnInit() {
    this.wb = XLSX.utils.book_new();
  }
  exportToExcel(data) {
    data.map((i) => {
      i.payrolls[0].payroll = i.payrolls[0]._id;
      i.payrolls[1].payroll = i.payrolls[1]._id;
      i.employee = i._id.employee;
      i.weekFrom = moment(i.payrolls[0].fromDate)
        .format('MM/DD/YYYY')
        .toString();
      i.weekTo = moment(i.payrolls[1].toDate).format('MM/DD/YYYY').toString();
      i.totalNetWage = Math.round(100 * i.totalNetWage) / 100;
      delete i._id;
      delete i.payrolls[0]._id;
      delete i.payrolls[1]._id;
      return i;
    });
    const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(this.wb, main, 'sheet 1');
    const date = moment().format('MM-DD-YYYY HH:mm:ss').toString();
    XLSX.writeFile(this.wb, `payroll-${date}.xlsx`);
    this._bottomSheetRef.dismiss(this.data);
  }
  openLink(e) {
    this._bottomSheetRef.dismiss(true);
    event.preventDefault();
  }
}
