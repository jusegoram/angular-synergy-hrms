import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { PayrollService } from '../../../../services/payroll.service';
import { SessionService } from '../../../../../session/session.service';
import { MatTableDataSource, MatSnackBar, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-edit-payroll-tab',
  templateUrl: './edit-payroll-tab.component.html',
  styleUrls: ['./edit-payroll-tab.component.scss']
})
export class EditPayrollTabComponent implements OnInit, OnChanges {
  @Input() data: MatTableDataSource<any>;
  @Output() apply =  new EventEmitter();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  selection = new SelectionModel(true, []);
  displayedColumns = ['select', 'employeeId' ,'employee', 'type', 'concept', 'amount', 'date', 'action'];
  dataSource: any;
  verificationFingerprint: any;
  constructor(
    private payrollService: PayrollService,
    private sessionService: SessionService,
    private snackbar: MatSnackBar) { }
ngOnChanges(changes: SimpleChanges): void {
  if (changes.data && changes.data.currentValue !== undefined) {
    changes.data.currentValue.paginator = this.paginator;
    this.buildTable(changes.data.currentValue);
  }
}
  ngOnInit() {

    this.verificationFingerprint = this.sessionService.getId();

  }

  onClickApply(e) {
    const rowId = this.data.data.indexOf(e);
    this.removeTableRow(rowId);
    this.apply.emit(e);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  removeTableRow(rowId) {
    console.log(rowId);
    if(rowId >= 0){
      const currentData = JSON.parse(JSON.stringify(this.data.data));
      currentData.splice(rowId, 1);
      this.data = new MatTableDataSource(currentData);
      this.buildTable(this.data);
    }
  }
  buildTable(data){
    data.paginator = this.paginator;
    this.selection = new SelectionModel(true, []);
    this.dataSource = null;
    this.dataSource = data;
  }
  openSnackbar(message, action) {
    this.snackbar.open(message, action, {duration: 10 * 1000} );
  }
}