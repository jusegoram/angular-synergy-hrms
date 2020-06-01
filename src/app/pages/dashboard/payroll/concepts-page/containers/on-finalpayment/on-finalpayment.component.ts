import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EmployeeService } from '@synergy-app/core/services';
import { DatePipe } from '@angular/common';
import { ColumnMode } from '@swimlane/ngx-datatable';
import moment from 'moment';
import Swal from 'sweetalert2';
import { LEAVE_STATUS } from '@synergy/environments/enviroment.common';
import { map } from 'rxjs/operators';
import { Employee, LeaveRequest } from '@synergy-app/shared/models';

@Component({
  selector: 'app-on-finalpayment',
  templateUrl: './on-finalpayment.component.html',
  styleUrls: ['./on-finalpayment.component.css'],
})
export class OnFinalpaymentComponent implements OnInit {
  @ViewChild('payLeaveTemplate', { static: true }) payLeaveTemplate: TemplateRef<any>;

  data: Array<any> = [];
  columns: Array<any> = [];
  ColumnMode = ColumnMode;
  constructor(private _employeeService: EmployeeService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.initTable();
    this.getOnFinalPayment();
  }
  initTable() {
    this.columns = [
      { name: 'EMPLOYEE ID', prop: 'employeeId', width: 50 },
      { name: 'NAME', prop: 'fullName', width: 200 },
      { name: 'CLIENT', prop: 'company.client'},
      { name: 'CAMPAIGN', prop: 'company.campaign'},
      { name: 'HIRE DATE', prop: 'company.hireDate', pipe: this.formatDate()},
      { name: 'TERMINATION DATE', prop: 'company.terminationDate', pipe: this.formatDate()},
      { name: 'MARK AS', prop: '_id', cellTemplate: this.payLeaveTemplate, width: 200 },
    ];
  }
  formatDate() {
    return { transform: (date) => this.datePipe.transform(date, 'MM/dd/yyyy') };
  }
  async getOnFinalPayment() {
    try {
      this.data = await this._employeeService
        .getEmployees(true)
        .pipe(
          map((employees) => {
            return employees.map((employee) => {
              employee.fullName = [employee.firstName, employee.middleName, employee.lastName].join(' ');
              return employee;
            });
          })
        ).toPromise();
    } catch (e) {
      console.log(e);
    }
  }
  confirmConceptCreated(employee) {
    Swal.fire({
      title: 'ARE YOU SURE',
      text: 'Please make sure the concept is created before accepting',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then(async (result) => {
      if (result.value) {
        await this.markAsConceptCreated(employee);
      }
    });
  }
  async markAsConceptCreated(employee) {
    try {
      const updateRequest: Partial<Employee> = {
        _id: employee,
        onFinalPayment: false,
      };
      await this._employeeService.updateEmployee(updateRequest).toPromise();
      await Swal.fire('Great!', 'The employee was processed successfully', 'success');
    } catch (error) {
      Swal.fire('Woa!', 'Error happened. Try again later.', 'error');
    } finally {
      await this.getOnFinalPayment();
    }
  }
}
