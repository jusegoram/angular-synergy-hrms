import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { PayrollService } from './../../../services/payroll.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PayrollConcept } from '../Concepts';
import { SessionService } from '../../../../session/session.service';
import { Employee } from '../../../../employee/Employee';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-concept',
  templateUrl: './new-concept.component.html',
  styleUrls: ['./new-concept.component.scss']
})
export class NewConceptComponent implements OnInit {
  bonuses: PayrollConcept[];
  deductions: PayrollConcept[];
  otherPayments: PayrollConcept[];

  conceptTypeList = [{
    type: 'Bonus',
    concepts: [
      { concept: 'One' }
    ]
  },
  {
    type: 'Deduction',
    concepts: [
      { concept: 'Magistrate Court' },
      { concept: 'Loan/Salary Advance' },
      { concept: 'Police Record' },
      { concept: 'Headset' },
      { concept: 'Uniform' },
      { concept: 'Quick Stop / AAA Loans' },
      { concept: 'Overpayment' },
      { concept: 'Early / Break Offender' },
    ]
  },
  {
    type: 'Other Payments',
    concepts: [
      { concept: 'Training Hours' },
      { concept: 'Training Stipend' },
      { concept: 'Attendance Bonus (Falcon)' },
      { concept: 'Certify Sick Leave' },
      { concept: 'Maternity' },
      { concept: 'Time off System' },
      { concept: 'Time off System 1.5' },
      { concept: 'Time off System 2X' },
      { concept: 'Card (cleaners/Security)' },
      { concept: 'Card 1.5' },
      { concept: 'Card 2X' },
      { concept: 'Salary Differences (Discrepancies)' },
    ]
  }
];

  conceptFromGroup: FormGroup
  employeeList: any;
  employeeConcepts: any;
  selectedEmployee: any;
  employeeConceptsColumns = ['type', 'concept', 'amount', 'date', 'status']
  filteredEmployees: Observable<Employee[]>;
  conceptTotalDays: number;
  constructor(
    public fb: FormBuilder,
    private sessionService: SessionService,
    private payrollService: PayrollService,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.getEmployees();
    this.buildForm();
    this.filteredEmployees = this.conceptFromGroup.controls['employee'].valueChanges
    .pipe(
      startWith(''),
      map(value => {
        return this.employeeList ? this._filterEmployees(value) : this.employeeList;
       })
    );
  }

  isMaternity = (concept) => concept === 'Maternity';
  isCSL = (concept) => concept === 'Certify Sick Leave'

  buildForm(){
    this.conceptFromGroup = this.fb.group({
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

  populateTable(data){
    this.employeeConcepts = null;
    this.employeeConcepts = new MatTableDataSource(data);
  }
  getEmployees(){
    this.payrollService.getEmployees().subscribe(result => {
      this.employeeList = result.map((item) => {
        item.fullSearchName =  `(${item.employeeId}) ${item.firstName} ${item.middleName} ${item.lastName}`;
        return item;
      });

    })
  }
  refreshTable(event){
    const data = this.employeeConcepts.data;
    data.push(event);
    this.employeeConcepts.data = data;
  }
  _filterEmployees(value: string): Employee[] {
    const filterValue = value.toString().toLowerCase();
    return this.employeeList.filter(employee => employee['fullSearchName'].toLowerCase().includes(filterValue));
  }
  setEmployee(employee: Employee) {
    this.selectedEmployee = employee;
  }
  onAddConcept(){
    const form = this.conceptFromGroup.value;
    const employee = this.selectedEmployee
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
      form.concept === 'Maternity',
      form.concept === 'Certify Sick Leave',
      form.from,
      form.to,
      this.calculateDaysDiff(form.from, form.to),
      form.diagnosis,
      form.institution,
      form.doctorName
    )
    this.saveConcept(newConcept);
  }

  calculateDaysDiff(from, to){
    let timeDiff = to.getTime() - from.getTime();
    return timeDiff / (1000 * 3600 * 24);
  }

  getConcepts(){
    const query = {
      type: this.conceptFromGroup.value.type.type,
      id: this.selectedEmployee._id,
      verified: null,
      payed: false,
    }
    this.payrollService.getConcepts(query.type, query.id, query.verified, query.payed).subscribe(res => {
      this.populateTable(res);
    })
  }
  saveConcept(concept){
    this.payrollService.saveConcept(concept).subscribe(res => {
      this.refreshTable(res);
      this.openSnackbar('The concept was succesfully saved', 'Great thanks!')
    })
  }
  openSnackbar(message, button) {
    this.snackbar.open(message, button, {duration: 10*1000})
  }

}
