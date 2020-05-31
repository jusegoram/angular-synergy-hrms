import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
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
  exportToExcel() {
    const exportData = this.data;
    const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(this.wb, main, 'sheet 1');
    const date = moment().format('MM-DD-YYYY HH:mm:ss').toString();
    XLSX.writeFile(this.wb, `payroll-calc-${date}.xlsx`);
    this._bottomSheetRef.dismiss(exportData);
  }
}
