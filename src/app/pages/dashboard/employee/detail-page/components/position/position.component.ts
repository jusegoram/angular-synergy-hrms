import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EmployeePosition } from '@synergy-app/shared/models';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnDeleteAlertComponent } from '@synergy-app/shared/modals';
import { USER_ROLES } from '@synergy/environments';

@Component({
  selector: 'app-position-info',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})
export class PositionComponent implements OnInit {
  @Input() employee: any;
  @Input() authorization: any;
  @Output() onDeleteConfirmation = new EventEmitter<any>();
  @Output() onAddButtonClicked = new EventEmitter<any>();
  @Input() departments;
  @Input() clients;
  @ViewChild('onDeleteAlert', { static: false })
  onDeleteAlert: OnDeleteAlertComponent;
  _roles = USER_ROLES;
  public dataSource: any;
  public positions: any;
  public position: any;

  positionForm: FormGroup;
  displayedColumns = ['client', 'department', 'position', 'positionId', 'startDate', 'endDate'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // this.clients = this._service.getClient(); <<<remove
    // this.departments = this._service.getDepartment(); <<<remove
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
    const { HUMAN_RESOURCES, WEB_ADMINISTRATOR } = this._roles;
    const { role } = this.authorization;
    if ([HUMAN_RESOURCES.value, WEB_ADMINISTRATOR.value].includes(role)) {
      this.displayedColumns.push('action');
    }
  }

  async onAdd() {
    if (this.positionForm.valid && this.positionForm.touched) {
      const { employee, client, department, position, start, end } = this.positionForm.value;
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

      this.onAddButtonClicked.emit({
        data: { employee: this.employee._id, position: newPosition },
        onPositionAdded: (docPosition) => {
          this.populateTable(docPosition);
          this.clearForm();
        },
      });
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

  onDelete(position: EmployeePosition) {
    this.onDeleteConfirmation.emit({
      data: {
        employee: this.employee._id,
        position: position,
      },
      removingItemFromTable: () => this.removeItemTable(position),
    });
  }
}
