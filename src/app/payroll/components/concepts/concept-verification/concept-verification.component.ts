import { SessionService } from './../../../../session/session.service';
import { PayrollService } from './../../../services/payroll.service';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-concept-verification',
  templateUrl: './concept-verification.component.html',
  styleUrls: ['./concept-verification.component.scss']
})
export class ConceptVerificationComponent implements OnInit {
  displayedColumns = ['select', 'employee', 'type', 'concept', 'amount', 'date', 'action'];
  verfiedTableColumns = ['employee','type', 'concept', 'amount', 'date', 'verified',]
  selection = new SelectionModel(true, []);
  verificationTable = new MatTableDataSource([]);
  verifiedTable = new MatTableDataSource([]);
  selectedConceptForVerification = 'Deduction';
  selectedconceptForVerified = 'Deduction';
  concepts = [
    {name: 'Deduction'},
    {name: 'Other Payments'}
  ]
  constructor(
    private payrollService: PayrollService,
    private sessionService: SessionService,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.getUnverifiedConcepts();
    this.getVerifiedConcepts();
  }
  buildVerificationTable(data){
    this.selection = new SelectionModel(true, []);
    this.verificationTable = null;
    this.verificationTable = new MatTableDataSource(data);
  }

  buildVerifiedTable(data){
    this.verifiedTable = null;
    this.verifiedTable = new MatTableDataSource(data)
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.verificationTable.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */


  getUnverifiedConcepts(){
    let type = this.selectedConceptForVerification;
    let query = {
      type: type,
      id: 'all',
      payed: false,
      verified: false,
    }
    this.payrollService.getConcepts(query.type, query.id, query.verified, query.payed).subscribe(res => {
      this.buildVerificationTable(res);
    })
  }
  getVerifiedConcepts(){
    let type = this.selectedconceptForVerified;
    let query = {
      type: type,
      id: 'all',
      payed: false,
      verified: true,
    }
    this.payrollService.getConcepts(query.type, query.id, query.verified, query.payed).subscribe(res => {
      this.buildVerifiedTable(res);
    })
  }
  verifyConcepts(single?){
    let verificationFingerprint = this.sessionService.getId();
    let selection = this.selection.selected;
    let type = single? single.type : selection[0].type;
    let opts = {
      type: type,
      id: [],
      query: {
        verificationFingerprint: verificationFingerprint,
        verified: true
      }
    };
    if(selection.length > 0) {
      let result = true;
      for (let i = 0; i < selection.length; i++) {
        const element = selection[i];
        if(element.creationFingerprint === verificationFingerprint)result = false;
      }
      if(result) {
        opts.id = selection.map(i => i._id)
        this.payrollService.updateConcept(opts).subscribe((res) => {
          this.getUnverifiedConcepts();
          this.getVerifiedConcepts();
          this.openSnackbar('The Concepts have been verified, thank you', 'Great!')
        }, error => {
          this.openSnackbar('Woops, an ERROR happened during the verification', 'Try Again')
        })
      }else {
        this.openSnackbar('Sorry, you cant verify your own concepts, ask an accounting teammate', 'Ok, sorry')
        return null};
    }
    else {
      if(single.creationFingerprint === verificationFingerprint) {
        this.openSnackbar('Sorry, you cant VERIFY your own concepts, ask an accounting teammate', 'Ok, sorry')
        return null
      }else {
        opts.id.push(single._id)
        this.payrollService.updateConcept(opts).subscribe((res) => {
          this.getUnverifiedConcepts();
          this.getVerifiedConcepts();
          this.openSnackbar('The Concepts have been verified, thank you', 'Great!')
        }, error => {
          this.openSnackbar('Woops, an ERROR happened during the verification', 'Try Again')
        })
      }
    }



  }
  deleteConcept(concept){
    let verificationFingerprint = this.sessionService.getId();
    if(concept.creationFingerprint === verificationFingerprint){
      this.openSnackbar('Sorry, you cant DELETE your own concepts, ask an accounting teammate', 'Ok, sorry')
    }else {
      this.payrollService.deleteConcept({type: concept.type, id: concept._id}).subscribe(result => {
        this.openSnackbar('The item was DELETED successfully', 'Great, thanks!');

      },(error) => {
        this.openSnackbar('Woops, an Error happened during the deletion', 'Try Again');
      })
    }
  }
  openSnackbar(message, action){
    this.snackbar.open(message, action, {duration: 10*1000})
  }
}
