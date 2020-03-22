import { FormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MinuteSecondsPipe } from '../../../../shared/pipes/minute-seconds.pipe';

@Component({
  selector: 'app-payslip-dialog',
  templateUrl: './payslip-dialog.component.html',
  styleUrls: ['./payslip-dialog.component.scss']
})
export class PayslipDialogComponent implements OnInit {
  myControl: FormControl;
  filteredEmployees: any;
  allEmployees: any;
  employeePayslip: any;
  constructor(
    private _exportasService: ExportAsService,
    public dialogRef: MatDialogRef<PayslipDialogComponent>,
    private minutesSecondsPipe: MinuteSecondsPipe,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.myControl = new FormControl('');
    this.allEmployees = this.data.map((item) => {
      item.fullSearchName =  `(${item.employeeId}) ${item.firstName} ${item.middleName} ${item.lastName}`;
      return item;
    });
    this.filteredEmployees = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => {
        return this.allEmployees ? this._filterEmployees(value) : this.allEmployees;
       })
    );
  }
  setEmployee(e) {
    this.employeePayslip = e;
  }
  _filterEmployees(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.allEmployees.filter(employee => employee['fullSearchName'].toLowerCase().includes(filterValue));
  }
  onDownload() {
    this.saveToPdf();
  }
  onDownloadAll() {
  }
  saveToPdf() {
    const config: ExportAsConfig = {
      type: 'pdf',
      elementId: 'payslip',
      options: {
         format: 'letter', orientation: 'portrait'
      }
    };
    this._exportasService.save(config, `${this.employeePayslip.fullSearchName}`).subscribe(() => {
  });
  }
  transform(hrs) {
    const result = this.minutesSecondsPipe.transform(hrs);
    return result;
  }
}
