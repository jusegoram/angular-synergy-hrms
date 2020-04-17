import { Component, EventEmitter, Input, OnInit, Output, ViewChild, } from '@angular/core';
import { EmployeePosition } from '@synergy-app/shared/models/employee/employee';
import { EmployeeService } from '@synergy-app/shared/services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnDeleteAlertComponent } from '@synergy-app/shared/modals/on-delete-alert/on-delete-alert.component';
import { Roles } from '@synergy-app/shared/global-constants/global-constants';
import { USER_ROLES } from '@synergy/environments/enviroment.common';

@Component({
  selector: 'position-info',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})
export class PositionComponent implements OnInit {
  @Input() employee: any;
  @Input() authorization: any;
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  @ViewChild('onDeleteAlert', {static: false})
  onDeleteAlert: OnDeleteAlertComponent;
  _roles = Roles;
  public dataSource: any;
  public positions: any;
  public position: any;
  public departments;
  public clients;
  positionForm: FormGroup;
  displayedColumns = [
    'client',
    'department',
    'position',
    'positionId',
    'startDate',
    'endDate',
  ];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _service: EmployeeService
  ) {
  }

  ngOnInit() {
    this.clients = this._service.getClient();
    this.departments = this._service.getDepartment();
    this.addActionColumn();
    this.populateTable(this.employee.position);
    this.buildForm();
  }

  buildForm() {
    this.positionForm = this.fb.group({
      employee: [this.employee._id],
      client: ['', [Validators.required]],
      department: ['', [Validators.required]],
      position: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: [''],
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  addActionColumn() {
    const {HUMAN_RESOURCES, WEB_ADMIN} = this._roles;
    const {role} = this.authorization;
    if ([HUMAN_RESOURCES, WEB_ADMIN].includes(role)) {
      this.displayedColumns.push('action');
    }
  }

  async onAdd() {
    if (this.positionForm.valid && this.positionForm.touched) {
      const {
        employee,
        client,
        department,
        position,
        start,
        end,
      } = this.positionForm.value;
      const newPosition: EmployeePosition = {
        employee: employee,
        client: client,
        department: department.name,
        positionId: position.positionId,
        name: position.name,
        baseWage: position.baseWage,
        startDate: start,
        endDate: end,
      };
      try {
        const {doc}: any = await this._service
          .savePosition({employee: this.employee._id, position: newPosition})
          .toPromise();
        this.populateTable(doc.position);
        this.clearForm();
        return this.onSuccess.emit();
      } catch (e) {
        return this.onError.emit();
      }
    } else {
      return this.positionForm.markAllAsTouched();
    }
  }

  clearForm() {
    this.positionForm.reset();
  }

  populateTable(event: any) {
    this.dataSource = new MatTableDataSource(event);
  }

  removeItemTable(item: EmployeePosition) {
    return new Promise((resolve, reject) => {
      const i = this.dataSource.data.indexOf(item);
      if (i > -1) {
        const newData = JSON.parse(JSON.stringify(this.dataSource.data));
        newData.splice(i, 1);
        this.dataSource = undefined;
        this.populateTable(newData);
        resolve();
      } else {
        reject();
      }
    });
  }

  setPositions(event: any) {
    this.positions = event;
  }

  async onDelete(position: EmployeePosition) {
    try {
      await this._service
        .deletePosition({employee: this.employee._id, position: position})
        .toPromise();
      await this.removeItemTable(position);
      return this.onSuccess.emit();
    } catch (e) {
      return this.onError.emit();
    }
  }
}
