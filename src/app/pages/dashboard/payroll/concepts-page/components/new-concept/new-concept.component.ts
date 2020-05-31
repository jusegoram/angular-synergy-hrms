import { CurrencyPipe, DatePipe } from '@angular/common';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, PayrollConcept } from '@synergy-app/shared/models';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TIME_VALUES } from '@synergy/environments';
import { LABORAL } from '@synergy/environments';

@Component({
  selector: 'app-new-concept',
  templateUrl: './new-concept.component.html',
  styleUrls: ['./new-concept.component.scss'],
})
export class NewConceptComponent implements OnInit {
  @Input() currentUserId: string;
  @Input() set employees(value: Employee[]) {
    if (value) {
      this.filterEmployeesOnEmployeeFieldValueChanges(value);
    }
  }
  @Input() set concepts(value: PayrollConcept[]) {
    if (value) {
      this.populateTable(value);
    }
  }
  @Output() onConceptTypeSelected = new EventEmitter<any>();
  @Output() onAddConceptButtonClicked = new EventEmitter<{ concept: PayrollConcept; onConceptSaved: Function }>();

  bonuses: PayrollConcept[];
  deductions: PayrollConcept[];
  otherPayments: PayrollConcept[];
  columns = [];
  rows = [];
  ColumnMode = ColumnMode;
  messages = {
    emptyMessage: 'PLEASE SELECT AN EMPLOYEE AND A CONCEPT TYPE TO LOAD INFO.',
  };

  conceptTypeList = LABORAL.PAYROLL.CONCEPT_TYPES;
  conceptFormGroup: FormGroup;
  employeeConcepts: any;
  selectedEmployee: any;
  employeeConceptsColumns = ['type', 'concept', 'amount', 'date', 'status'];
  filteredEmployees: Observable<Employee[]>;
  conceptTotalDays: number;
  constructor(
    public fb: FormBuilder,
    private payrollService: PayrollService,
    private snackbar: MatSnackBar,
    private currency: CurrencyPipe,
    private _datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.columns = [
      { name: 'CONCEPT', prop: 'type' },
      { name: 'REASON', prop: 'reason' },
      { name: 'AMOUNT', prop: 'amount', pipe: this.currency },
      { name: 'EFFECTIVE', prop: 'date', pipe: this.datePipe() },
      { name: 'VERIFIED', prop: 'verified' },
    ];
    this.buildForm();
  }
  isNotice = (concept) => concept === 'Notice Payment';
  isSeverance = (concept) => concept === 'Severance';
  isCompassionateLeave = (concept) => concept === 'Compassionate Leave';
  isMaternity = (concept) => concept === 'Maternity Leave';
  isCSL = (concept) => concept === 'Certify Sick Leave';
  isTaxableBonus = (type) => type === 'Taxable Bonus';
  datePipe() {
    return {
      transform: (value) => this._datePipe.transform(value, 'MM/dd/yyyy'),
    };
  }
  buildForm() {
    this.conceptFormGroup = this.fb.group({
      employee: ['', Validators.required],
      type: ['', Validators.required],
      concept: ['', Validators.required],
      amount: ['', Validators.required],
      date: ['', Validators.required],
      from: [],
      to: [],
      diagnosis: [],
      institution: [],
      doctorName: [],
    });
  }
  resetForm() {
    this.conceptFormGroup.controls.type.reset();
    this.conceptFormGroup.controls.concept.reset();
    this.conceptFormGroup.controls.amount.reset();
    this.conceptFormGroup.controls.date.reset();
    this.conceptFormGroup.controls.from.reset();
    this.conceptFormGroup.controls.to.reset();
    this.conceptFormGroup.controls.diagnosis.reset();
    this.conceptFormGroup.controls.institution.reset();
    this.conceptFormGroup.controls.doctorName.reset();
  }
  populateTable(data) {
    this.rows = data;
  }

  refreshTable(event) {
    this.populateTable([...this.rows, event]);
  }

  filterEmployeesOnEmployeeFieldValueChanges(employees: Employee[]) {
    this.filteredEmployees = this.conceptFormGroup.controls['employee'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        return employees ? this._filterEmployees(value, employees) : employees;
      })
    );
  }

  _filterEmployees(value: string, employees: Employee[]): Employee[] {
    const filterValue = value.toString().toLowerCase();
    return employees.filter((employee) => employee['fullSearchName'].toLowerCase().includes(filterValue));
  }
  setEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.resetForm();
  }

  addConcept() {
    const form = this.conceptFormGroup.value;
    const employee = this.selectedEmployee;
    const newConcept = new PayrollConcept(
      form.type.type,
      employee._id,
      `${employee.firstName} ${employee.middleName} ${employee.lastName}`,
      employee.employeeId,
      form.concept,
      form.date,
      new Date(),
      parseFloat(form.amount),
      this.currentUserId,
      null,
      false,
      false,
      new Date(),
      this.currentUserId,
      this.isMaternity(form.concept),
      this.isCSL(form.concept),
      form.from,
      form.to,
      this.calculateDaysDiff(form.from, form.to),
      form.diagnosis,
      form.institution,
      form.doctorName,
      false,
      null,
      null,
      this.isNotice(form.concept),
      this.isSeverance(form.concept),
      this.isCompassionateLeave(form.concept),
      false,
      this.isTaxableBonus(form.type.type)
    );
    this.onAddConceptButtonClicked.emit({
      concept: newConcept,
      onConceptSaved: (response) => {
        this.refreshTable(response);
        this.resetForm();
      },
    });
  }

  calculateDaysDiff(from, to) {
    if (from && to) {
      const timeDiff = to.getTime() - from.getTime();
      return timeDiff / (1000 * TIME_VALUES.SECONDS_PER_HOUR * TIME_VALUES.HOURS_PER_DAY);
    }
    return null;
  }

  getConcepts() {
    const form = this.conceptFormGroup.value;
    const query = {
      type: form.type.type,
      id: this.selectedEmployee._id,
      verified: false,
      payed: false,
      assigned: false,
    };
    if (form.type.type === 'Taxable Bonus' || form.type.type === 'Non-Taxable Bonus') {
      Object.assign(query, {
        taxable: this.isTaxableBonus(form.type.type),
      });
    }
    this.onConceptTypeSelected.emit(query);
  }

  openSnackbar(message, button) {
    this.snackbar.open(message, button, { duration: 10 * 1000 });
  }

  // TODO: upload bulk, api is ready to take bulk
}
