import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noop } from 'rxjs';
import { TIME_VALUES } from '@synergy/environments/enviroment.common';


@Component({
  selector: 'app-edit-payroll-detail-vacations',
  templateUrl: './edit-payroll-detail-vacations.component.html',
  styleUrls: ['./edit-payroll-detail-vacations.component.scss'],
})
export class EditPayrollDetailVacationsComponent implements OnInit {
  @ViewChild('editCell', {static: true}) editCell: TemplateRef<any>;
  @ViewChild('confirmSwal') private confirmSwal: SwalComponent;
  @ViewChild('successSwal') private successSwal: SwalComponent;

  @Input() user: any;
  @Input() row: any;
  @Input() set concepts(value) {
    if (value) {
      this.rows = [...value];
    }
  }

  @Output() onAddVacationsButtonClicked = new EventEmitter<any>();
  @Output() onDeleteConceptButtonClicked = new EventEmitter<any>();
  @Output() onConfirmConceptButtonClicked = new EventEmitter<any>();

  columns: any[] = [];
  rows = new Array<any>();
  vacationsForm: FormGroup;
  ColumnMode = ColumnMode;

  constructor(
    private fb: FormBuilder,
    private _currencyPipe: CurrencyPipe,
    private _datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.columns = [
      {name: 'FROM', prop: 'from', pipe: this.datePipe()},
      {name: 'TO', prop: 'to', pipe: this.datePipe()},
      {name: 'AMOUNT', prop: 'amount', width: 85, pipe: this._currencyPipe},
      {name: 'CONFIRM | DELETE', cellTemplate: this.editCell, width: 155},
    ];
    this.buildForm();
  }

  datePipe() {
    return {
      transform: (value) => this._datePipe.transform(value, 'MM/dd/yyyy'),
    };
  }
  buildForm() {
    const r = this.row;
    this.vacationsForm = this.fb.group({
      type: ['Other Payments'],
      vacations: [true],
      employee: [r.employee],
      employeeName: [r.employeeName],
      employeeId: [r.employeeId],
      reason: ['Vacations Leave'],
      date: [r.fromDate],
      from: ['', Validators.required],
      to: ['', Validators.required],
      amount: ['', Validators.required],
      creationFingerprint: [this.user.userId],
      submittedDate: [new Date()],
      createdBy: [this.user.userId],
      assigned: [true],
      payroll: [r.payroll_Id],
    });
  }

  calculateDaysDiff(from, to) {
    if (from && to) {
      const timeDiff = to.getTime() - from.getTime();
      return timeDiff / (1000 * TIME_VALUES.SECONDS_PER_HOUR * TIME_VALUES.HOURS_PER_DAY);
    }
    return null;
  }

  saveValue() {
    this.onAddVacationsButtonClicked.emit({
      payroll: {
        ...this.vacationsForm.value,
        totalDays: this.calculateDaysDiff(this.vacationsForm.value.from, this.vacationsForm.value.to),
      },
      onPayrollSaved: (response) => {
        this.rows = [...this.rows, response];
        this.buildForm();
      }
    });
  }

  confirmValue(...args) {
    const [rowItem, index] = args;
    if (this.user.userId === rowItem.creationFingerprint) {
      this.confirmSwal.fire().then((e) => noop());
    } else {
      this.onConfirmConceptButtonClicked.emit(
        {
          payroll: rowItem,
          onConceptConfirmStatusSaved: (response) => {
            if (response) {
              rowItem.verified = true;
              rowItem.verificationFingerprint = this.user.userId;
              this.successSwal
                    .fire()
                    .then((e) => console.log(e))
                    .catch((e) => console.log(e));
            }
          }
        }
      );


    }
  }
  deleteValue(item, index) {
    this.onDeleteConceptButtonClicked.emit(item);
    this.rows.splice(index, 1);
    // this.rows.splice(index, 1);
  }
}
