import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-export-bottom-sheet',
  templateUrl: './export-bottom-sheet.component.html',
  styleUrls: ['./export-bottom-sheet.component.scss']
})
export class ExportBottomSheetComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<ExportBottomSheetComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  ngOnInit() {
  }

  openLink(e){
    this._bottomSheetRef.dismiss(true);
    event.preventDefault();
  }
}
