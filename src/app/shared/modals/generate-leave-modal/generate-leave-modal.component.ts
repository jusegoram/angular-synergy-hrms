import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Employee, LeaveRequest } from '@synergy-app/shared/models';
import { AdminService, EmployeeService, SessionService } from '@synergy-app/core/services';
import { Observable, fromEvent } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { TIME_VALUES, LEAVE_STATUS } from '@synergy/environments';
import { CommonValidator } from '@synergy-app/shared/validators/common.validator';

@Component({
  selector: 'app-generate-leave-modal',
  templateUrl: './generate-leave-modal.component.html',
  styleUrls: ['./generate-leave-modal.component.scss'],
})
export class GenerateLeaveModalComponent implements OnInit {
  generateLeaveRequestForm: FormGroup;
  selectedEmployee: Employee;
  employees: any[];
  leaveTypes = [];
  filteredEmployees: Observable<any[]>;
  leaveRequest: Partial<LeaveRequest>;
  isLeaveTypeVacations = true;
  today = new Date();
  @ViewChild('inputSearchEmployee', { static: true }) inputSearchEmployee: any;

  constructor(
    public dialogRef: MatDialogRef<GenerateLeaveModalComponent>,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdminService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.leaveTypes = this.data.isHRMode
      ? ['Vacations', 'Leave without pay', 'Compassionate', 'Maternity', 'Sick Leave']
      : ['Vacations', 'Leave without pay'];
    this.leaveRequest = this.isEditMode
      ? this.data.leaveRequest
      : {
          employee: {
            _id: '',
          },
          excuseDescription: '',
          leaveType: {
            isCashVacations: false,
            name: 'Vacations',
          },
          state: LEAVE_STATUS.SENT, // first status
        };
    this.setUpGenerateLeaveForm();
    this.fetchEmployees();
    this.setUpInputSearchFilter();
  }

  setUpGenerateLeaveForm() {
    const { excuseDescription, leaveType, excuseTimeFrom, excuseTimeTo } = this.leaveRequest;
    /* SatDatepick */
    let fromToDateRange = {};
    if (excuseTimeFrom && excuseTimeTo) {
      fromToDateRange = { begin: excuseTimeFrom, end: excuseTimeTo };
    }
    this.generateLeaveRequestForm = this.formBuilder.group({
      excuseDescription: [excuseDescription, [Validators.required, CommonValidator.emptyFieldValidator]],
      leaveTypeName: [leaveType.name, [Validators.required]],
      isCashVacations: [leaveType.isCashVacations],
      fromToDateRange: [fromToDateRange, [Validators.required]],
    });
  }

  setUpInputSearchFilter() {
    this.filteredEmployees = fromEvent(this.inputSearchEmployee.nativeElement, 'keydown').pipe(
      debounceTime(TIME_VALUES.SHORT_DEBOUNCE_TIME),
      map((event: any) => this.filterEmployees(event.target.value))
    );
  }

  filterEmployees(filter: string): Employee[] {
    const filterValue = filter.toString().trim().toLowerCase();
    if (filterValue.length >= 3) {
      return this.employees.filter((employee) => {
        return employee['fullSearchName'].toLowerCase().includes(filterValue);
      });
    }
    return this.employees;
  }

  fetchEmployees() {
    this.adminService.getEmployees().subscribe((data) => {
      data.map((item) => {
        item.fullSearchName =
          '(' + item.employeeId + ') - ' + item.firstName + ' ' + item.middleName + ' ' + item.lastName;
        if (this.isEditMode && item._id === this.leaveRequest.employee._id) {
          this.selectedEmployee = item;
          this.inputSearchEmployee.nativeElement.value = item.fullSearchName;
        }
      });
      this.employees = data;
    });
  }

  get isFormValid(): boolean {
    return this.generateLeaveRequestForm.valid && this.selectedEmployee !== undefined;
  }

  get title(): string {
    return (this.isEditMode ? 'EDIT' : 'CREATE') + ' LEAVE';
  }

  get isEditMode() {
    return this.data.mode === 'edit';
  }

  checkIfLeaveTypeIsVacations(leaveType) {
    this.isLeaveTypeVacations = leaveType.value === 'Vacations';
    if (!this.isLeaveTypeVacations) {
      this.generateLeaveRequestForm.get('isCashVacations').setValue(false);
    }
  }

  setEmployee(employee: Employee) {
    this.selectedEmployee = employee;
  }

  async manageLeaveRequest(formValues: any) {
    try {
      const { isCashVacations, excuseDescription, fromToDateRange, leaveTypeName } = formValues;
      const leaveRequest: Partial<LeaveRequest> = this.leaveRequest;
      const { userId, name, role } = this.sessionService.decodeToken();

      // if first time
      if (!this.isEditMode) {
        // set employee
        if (this.selectedEmployee._id !== leaveRequest._id) {
          const fullName =
            this.selectedEmployee.firstName +
            ' ' +
            this.selectedEmployee.middleName +
            ' ' +
            this.selectedEmployee.lastName;
          const employeeId = this.selectedEmployee.employeeId + '';
          leaveRequest.employee = {
            _id: this.selectedEmployee._id,
            employeeId,
            fullName,
          };
        }
        // set creation fingerprint
        leaveRequest.creationFingerprint = {
          _id: userId,
          name,
          role,
        };
      }

      leaveRequest.leaveType = {
        isCashVacations,
        name: leaveTypeName,
      };

      leaveRequest.excuseDescription = excuseDescription;
      leaveRequest.excuseTimeFrom = fromToDateRange.begin;
      leaveRequest.excuseTimeTo = fromToDateRange.end;

      // create on first time
      if (!this.isEditMode) {
        await this.employeeService.saveLeave(leaveRequest);
      } else {
        // then update it
        await this.employeeService.updateLeave(leaveRequest);
      }
      this.dialogRef.close({
        state: true,
        message: 'Leave info send successfully',
      });
    } catch (error) {
      console.log(error);
      this.dialogRef.close({
        state: false,
        message: 'We couldn\'t send your request. Try again later.',
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
