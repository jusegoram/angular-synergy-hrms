import { FormGroup, FormBuilder } from '@angular/forms';
import { PayrollConcept } from './Concepts';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.component.html',
  styleUrls: ['./concepts.component.scss']
})
export class ConceptsComponent implements OnInit {

  bonuses: PayrollConcept[];
  deductions: PayrollConcept[];
  otherPayments: PayrollConcept[];
  employees: any;

  conceptTypeList = [{
    type: 'Bonus',
    concepts: [
      { concept: 'One' }
    ]
  },
  {
    type: 'Deduction',
    concepts: [
      { concept: 'One' }
    ]
  },
  {
    type: 'Other Payments',
    concepts: [
      { concept: 'One' }
    ]
  }
];

  conceptFromGroup: FormGroup
  constructor(public fb: FormBuilder) {

  }

  ngOnInit() {
  }

  saveConcept(){

  }

  editConcept(){

  }

  deleteConcept(){

  }
}
