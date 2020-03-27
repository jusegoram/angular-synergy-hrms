import { CurrencyPipe, DatePipe } from "@angular/common";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PayrollService } from "./../../../services/payroll.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PayrollConcept } from "../Concepts";
import { SessionService } from "../../../../session/session.service";
import { Employee } from "../../../../employee/Employee";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "app-new-concept",
  templateUrl: "./new-concept.component.html",
  styleUrls: ["./new-concept.component.scss"],
})
export class NewConceptComponent implements OnInit {
  bonuses: PayrollConcept[];
  deductions: PayrollConcept[];
  otherPayments: PayrollConcept[];
  columns = [];
  rows = new Array();
  ColumnMode = ColumnMode;
  messages = {
    emptyMessage: "PLEASE SELECT AN EMPLOYEE AND A CONCEPT TYPE TO LOAD INFO.",
  };

  conceptTypeList = [
    {
      type: "Taxable Bonus",
      concepts: [{ concept: "Other Bonus" }],
    },
    {
      type: "Non-Taxable Bonus",
      concepts: [{ concept: "Attendance Bonus (Falcon)" }],
    },
    {
      type: "Deduction",
      concepts: [
        { concept: "Magistrate Court" },
        { concept: "Loan/Salary Advance" },
        { concept: "Police Record" },
        { concept: "Headset" },
        { concept: "Uniform" },
        { concept: "Quick Stop / AAA Loans" },
        { concept: "Overpayment" },
        { concept: "Early / Break Offender" },
      ],
    },
    {
      type: "Other Payments",
      concepts: [
        { concept: "Certify Sick Leave" },
        { concept: "Compassionate Leave" },
        { concept: "Maternity Leave" },
        { concept: "Training Hours" },
        { concept: "Training Stipend" },
        { concept: "Time off System" },
        { concept: "Time off System 1.5" },
        { concept: "Time off System 2X" },
        { concept: "Card (cleaners/Security)" },
        { concept: "Card 1.5" },
        { concept: "Card 2X" },
        { concept: "Salary Differences (Discrepancies)" },
      ],
    },
    {
      type: "Final Payments",
      concepts: [{ concept: "Severance" }, { concept: "Notice Payment" }],
    },
  ];

  conceptFormGroup: FormGroup;
  employeeList: any;
  employeeConcepts: any;
  selectedEmployee: any;
  employeeConceptsColumns = ["type", "concept", "amount", "date", "status"];
  filteredEmployees: Observable<Employee[]>;
  conceptTotalDays: number;
  constructor(
    public fb: FormBuilder,
    private sessionService: SessionService,
    private payrollService: PayrollService,
    private snackbar: MatSnackBar,
    private currency: CurrencyPipe,
    private _datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.columns = [
      { name: "CONCEPT", prop: "type" },
      { name: "REASON", prop: "reason" },
      { name: "AMOUNT", prop: "amount", pipe: this.currency },
      { name: "EFFECTIVE", prop: "date", pipe: this.datePipe() },
      { name: "VERIFIED", prop: "verified" },
    ];
    this.getEmployees();
    this.buildForm();
    this.filteredEmployees = this.conceptFormGroup.controls[
      "employee"
    ].valueChanges.pipe(
      startWith(""),
      map((value) => {
        return this.employeeList
          ? this._filterEmployees(value)
          : this.employeeList;
      })
    );
  }
  isNotice = (concept) => concept === "Notice Payment";
  isSeverance = (concept) => concept === "Severance";
  isCompassionateLeave = (concept) => concept === "Compassionate Leave";
  isMaternity = (concept) => concept === "Maternity Leave";
  isCSL = (concept) => concept === "Certify Sick Leave";
  isTaxableBonus = (type) => type === "Taxable Bonus";
  datePipe() {
    return {
      transform: (value) => this._datePipe.transform(value, "MM/dd/yyyy"),
    };
  }
  buildForm() {
    this.conceptFormGroup = this.fb.group({
      employee: ["", Validators.required],
      type: ["", Validators.required],
      concept: ["", Validators.required],
      amount: ["", Validators.required],
      date: ["", Validators.required],
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
    // this.employeeConcepts = null;
    // this.employeeConcepts = new MatTableDataSource(data);
    this.rows = data;
  }
  getEmployees() {
    this.payrollService.getEmployees().subscribe((result) => {
      this.employeeList = result.map((item) => {
        item.fullSearchName = `(${item.employeeId}) ${item.firstName} ${item.middleName} ${item.lastName}`;
        return item;
      });
    });
  }
  refreshTable(event) {
    this.populateTable([event]);
  }
  _filterEmployees(value: string): Employee[] {
    const filterValue = value.toString().toLowerCase();
    return this.employeeList.filter((employee) =>
      employee["fullSearchName"].toLowerCase().includes(filterValue)
    );
  }
  setEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.resetForm();
  }
  onAddConcept() {
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
      this.sessionService.getId(),
      null,
      false,
      false,
      new Date(),
      this.sessionService.getId(),
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
    this.saveConcept(newConcept).then((resolved) => {
      this.resetForm();
    });
  }

  calculateDaysDiff(from, to) {
    if (from && to) {
      const timeDiff = to.getTime() - from.getTime();
      return timeDiff / (1000 * 3600 * 24);
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
    if (
      form.type.type === "Taxable Bonus" ||
      form.type.type === "Non-Taxable Bonus"
    ) {
      Object.assign(query, {
        taxable: this.isTaxableBonus(form.type.type),
      });
    }
    this.payrollService.getConcepts(query).subscribe((res) => {
      this.populateTable(res);
    });
  }
  saveConcept(concept) {
    return new Promise((resolve, reject) => {
      this.payrollService.saveConcept(concept).subscribe((res) => {
        this.refreshTable(res);
        this.openSnackbar("The concept was succesfully saved", "Great thanks!");
        resolve();
      });
    });
  }
  openSnackbar(message, button) {
    this.snackbar.open(message, button, { duration: 10 * 1000 });
  }

  // TODO: upload bulk, api is ready to take bulk
}
