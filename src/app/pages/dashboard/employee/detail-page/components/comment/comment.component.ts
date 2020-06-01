import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Employee, EmployeeComment } from '@synergy-app/shared/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { OnDeleteAlertComponent } from '@synergy-app/shared/modals';
import { noop } from 'rxjs';

@Component({
  selector: 'app-comment-info',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() employee: Employee;
  @Input() authorization: any;
  @Input() currentUser: any;
  @Output() onSubmitButtonClicked = new EventEmitter<EmployeeComment>();
  @Output() onDeleteConfirmation = new EventEmitter<EmployeeComment>();
  @Output() onError = new EventEmitter<any>();
  @ViewChild('onDeleteAlert', { static: false })
  onDeleteAlert: OnDeleteAlertComponent;
  public dataSource: any;
  public displayedColumns = ['comment', 'by', 'date'];
  public commentForm: FormGroup;
  private employeeComment: any;

  constructor(private _formBuilder: FormBuilder) {}

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
    const { _id, firstName, lastName } = this.currentUser;
    this.commentForm = this._formBuilder.group({
      employee: [this.employee._id],
      comment: ['', Validators.required],
      commentDate: [new Date()],
      submittedBy: [
        {
          _id,
          firstName,
          lastName,
        },
      ],
    });
  }

  populateTable(event: any) {
    this.dataSource = new MatTableDataSource(event);
  }

  async onSubmit() {
    if (this.commentForm.valid && this.commentForm.touched) {
      const comment: EmployeeComment = {
        ...this.commentForm.value,
      };
      this.onSubmitButtonClicked.emit(comment);
      this.clearForm();
    }
    return;
  }

  fireDelete(item) {
    if (item.submittedBy._id === this.currentUser._id) {
      return this.onDeleteAlert.fire(item);
    }
    return this.onError.emit();
  }

  onDelete(item) {
    this.onDeleteConfirmation.emit(item);
  }

  clearForm() {
    this.commentForm.controls.comment.reset();
  }
}
