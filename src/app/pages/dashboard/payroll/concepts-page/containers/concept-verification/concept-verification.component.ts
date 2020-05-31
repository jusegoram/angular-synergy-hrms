import { SessionService } from '@synergy-app/core/services';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-concept-verification',
  templateUrl: './concept-verification.component.html',
  styleUrls: ['./concept-verification.component.scss'],
})
export class ConceptVerificationComponent implements OnInit {
  @ViewChild('confirmSwal') private confirmSwal: SwalComponent;
  @ViewChild('successSwal') private successSwal: SwalComponent;
  displayedColumns = ['select', 'employee', 'type', 'concept', 'amount', 'date', 'action'];
  verfiedTableColumns = ['employee', 'type', 'concept', 'amount', 'date', 'verified'];
  selection = new SelectionModel(true, []);
  verificationTable = new MatTableDataSource([]);
  verifiedTable = new MatTableDataSource([]);
  selectedConceptForVerification = 'Deduction';
  selectedconceptForVerified = 'Deduction';
  concepts = [
    { name: 'Deduction' },
    { name: 'Other Payments' },
    { name: 'Taxable Bonus' },
    { name: 'Non-Taxable Bonus' },
  ];

  constructor(
    private payrollService: PayrollService,
    private sessionService: SessionService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.refresh();
  }
  buildVerificationTable(data) {
    this.selection = new SelectionModel(true, []);
    this.verificationTable = null;
    this.verificationTable = new MatTableDataSource(data);
  }

  buildVerifiedTable(data) {
    this.verifiedTable = null;
    this.verifiedTable = new MatTableDataSource(data);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.verificationTable.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */

  getUnverifiedConcepts() {
    const type = this.selectedConceptForVerification;
    const query = {
      type: type,
      id: 'all',
      payed: false,
      verified: false,
      assigned: false,
    };
    this.payrollService.getConcepts(query).subscribe((res) => {
      this.buildVerificationTable(res);
    });
  }
  getVerifiedConcepts() {
    const type = this.selectedconceptForVerified;
    const query = {
      type: type,
      id: 'all',
      payed: false,
      verified: true,
      assigned: false,
    };
    this.payrollService.getConcepts(query).subscribe((res) => {
      this.buildVerifiedTable(res);
    });
  }
  verifyConcepts(single?) {
    const verificationFingerprint = this.sessionService.getId();
    const selection = this.selection.selected;
    const type = single ? single.type : selection[0].type;
    const opts = {
      type: type,
      id: [],
      query: {
        verificationFingerprint: verificationFingerprint,
        verified: true,
      },
    };
    if (selection.length > 0) {
      let result = true;
      for (let i = 0; i < selection.length; i++) {
        const element = selection[i];
        if (element.creationFingerprint === verificationFingerprint) {
          result = false;
        }
      }
      if (result) {
        opts.id = selection.map((i) => i._id);
        this.payrollService.updateConcept(opts).subscribe(
          (res) => {
            this.refresh();
            this.successSwal.fire().then((e) => {});
          },
          (error) => {
            this.confirmSwal.fire().then((e) => {});
          }
        );
      } else {
        this.confirmSwal.fire().then((e) => {});
        return null;
      }
    } else {
      if (single.creationFingerprint === verificationFingerprint) {
        this.confirmSwal.fire().then((e) => {});
        return null;
      } else {
        opts.id.push(single._id);
        this.payrollService.updateConcept(opts).subscribe(
          (res) => {
            this.refresh();
            this.successSwal.fire().then((e) => {});
          },
          (error) => {
            this.openSnackbar('Woops, an ERROR happened during the verification', 'Try Again');
          }
        );
      }
    }
  }
  deleteConcept(concept) {
    const verificationFingerprint = this.sessionService.getId();
    if (concept.creationFingerprint === verificationFingerprint) {
      this.openSnackbar('Sorry, you cant DELETE your own concepts, ask an accounting teammate', 'Ok, sorry');
    } else {
      this.payrollService.deleteConcept({ type: concept.type, id: concept._id }).subscribe(
        (result) => {
          this.refresh();
          this.openSnackbar('The item was DELETED successfully', 'Great, thanks!');
        },
        (error) => {
          this.openSnackbar('Woops, an Error happened during the deletion', 'Try Again');
        }
      );
    }
  }
  openSnackbar(message, action) {
    this.snackbar.open(message, action, { duration: 10 * 1000 });
  }
  refresh() {
    this.getUnverifiedConcepts();
    this.getVerifiedConcepts();
  }
}
