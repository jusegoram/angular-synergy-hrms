import { Component, OnInit } from '@angular/core';
import { EmployeeService, SessionService } from '@synergy-app/core/services';
import moment from 'moment';
import { LeaveRequest, Employee, PayrollConcept } from '@synergy-app/shared/models';
import { LEAVE_STATUS } from '@synergy/environments/enviroment.common';
import Swal from 'sweetalert2';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-concepts',
  templateUrl: './concepts-page.component.html',
  styleUrls: ['./concepts-page.component.scss'],
})
export class ConceptsPageComponent implements OnInit {
  certifiedLeaves$: Promise<Array<LeaveRequest>>;
  employees$: Observable<Array<Employee>>;
  concepts$: Observable<Array<PayrollConcept>>;
  userId: string;

  constructor(
    private sessionService: SessionService,
    private employeeService: EmployeeService,
    private payrollService: PayrollService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userId = this.sessionService.getId();
    this.fetchCertifiedLeaves();
    this.fetchEmployees();
  }

  editConcept() {}

  deleteConcept() {}

  fetchCertifiedLeaves() {
    try {
      this.certifiedLeaves$ = this.employeeService.getLeaves({
        state: LEAVE_STATUS.FINISHED,
        excuseTimeFrom: moment().endOf('day').toISOString(),
      });
    } catch (e) {
      console.log(e);
    }
  }

  fetchEmployees() {
    this.employees$ = this.payrollService.getEmployees().pipe(
      map((result) =>
        result.map((item) => {
          item.fullSearchName = `(${item.employeeId}) ${item.firstName} ${item.middleName} ${item.lastName}`;
          return item;
        })
      )
    );
  }

  fetchConcepts(query) {
    this.concepts$ = this.payrollService.getConcepts(query);
  }

  async saveConcept(params) {
    const { concept, onConceptSaved } = params;
    try {
      const response = await this.payrollService.saveConcept(concept).toPromise();
      this.openSnackbar('The concept was succesfully saved', 'Great thanks!');
      onConceptSaved(response);
    } catch (error) {
      this.openSnackbar('ERROR: ' + error.error.message, 'Dismiss');
    }
  }

  async saveMarkAsConceptCreatedStatusToLeave(leaveId: string) {
    try {
      const leaveRequest: Partial<LeaveRequest> = {
        _id: leaveId,
        state: LEAVE_STATUS.PROCESSED,
      };
      await this.employeeService.updateLeave(leaveRequest);
      this.fetchCertifiedLeaves();
      await Swal.fire('Great!', 'The leave was processed successfully', 'success');
    } catch (error) {
      Swal.fire('Woa!', 'Error happened. Try again later.', 'error');
    }
  }

  openSnackbar(message, button) {
    this.snackbar.open(message, button, { duration: 10 * 1000 });
  }
}
