import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Employee, EmployeeComment, } from '@synergy-app/shared/models/employee/employee';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '@synergy-app/shared/services/employee.service';
import { SessionService } from '@synergy-app/shared/services/session.service';
import { OnDeleteAlertComponent } from '@synergy-app/shared/modals/on-delete-alert/on-delete-alert.component';
import { noop } from 'rxjs';

@Component({
  selector: 'comment-info',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() employee: Employee;
  @Input() authorization: any;
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  @ViewChild('onDeleteAlert', {static: false})
  onDeleteAlert: OnDeleteAlertComponent;
  public dataSource: any;
  public displayedColumns = ['comment', 'by', 'date'];
  public commentForm: FormGroup;
  private employeeComment: any;
  private userFullName: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _service: EmployeeService,
    private _session: SessionService
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.employee) {
      this.dataSource = undefined;
      this.employeeComment = [...this.employee.comments];
      this.populateTable(this.employeeComment);
    }
  }

  ngOnInit() {
    this.authorization.edit && this.authorization.create ? this.addActionColumn() : noop();
    this.employeeComment = [...this.employee.comments];
    this.populateTable(this.employeeComment);
    this.buildForms();
  }

  addActionColumn() {
    this.displayedColumns.push('action');
  }

  buildForms() {
    this.userFullName = this._session.getName().split(' ');
    this.commentForm = this._formBuilder.group({
      employee: [this.employee._id],
      comment: ['', Validators.required],
      commentDate: [new Date()],
      submittedBy: [
        {
          _id: this._session.getId(),
          firstName: this.userFullName[0],
          lastName: this.userFullName[this.userFullName.length - 1],
        }
      ],
    });
  }

  populateTable(event: any) {
    this.dataSource = new MatTableDataSource(event);
  }

  async onSubmit() {
    if (this.commentForm.valid && this.commentForm.touched) {
      const comment: EmployeeComment = {
        ...this.commentForm.value
      };
      try {
        await this._service.saveComment(comment).toPromise();
        this.clearForm();
        return this.onSuccess.emit();
      } catch (e) {
        return this.onError.emit();
      }
    }
    return;
  }

  fireDelete(item) {
    if (item.submittedBy._id === this._session.getId()) {
      return this.onDeleteAlert.fire(item);
    }
    return this.onError.emit();
  }

  async onDelete(item) {
    try {
      await this._service.deleteComment(item).toPromise();
      return this.onSuccess.emit();
    } catch (e) {
      return this.onError.emit();
    }
  }

  clearForm() {
    this.commentForm.controls.comment.reset();
  }
}
