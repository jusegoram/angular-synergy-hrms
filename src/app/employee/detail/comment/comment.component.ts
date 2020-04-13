import { Component, Input, OnInit } from '@angular/core';
import { Employee, EmployeeComment } from '../../employee.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../../employee.service';
import { SessionService } from '../../../session/session.service';

@Component({
  selector: 'comment-info',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() employee: Employee;
  @Input() authorization: any;
  dataSource: any;
  public isEdit: false;
  employeeComment: any;
  editCommentId: string;
  editCommentDate: Date;
  displayedColumns = ['comment', 'by', 'date'];
  public commentForm: FormGroup;
  userFullName: any;
  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.employeeComment = this.employee.comments;
    this.populateTable(this.employeeComment);
    this.buildForms();
    this.userFullName = this.sessionService.getName().split(' ');
  }
  buildForms() {
    this.commentForm = this.fb.group({
      comment: [''],
    });
  }

  populateTable(event: any) {
    if (this.dataSource) {
      const data = this.dataSource.data;
      data.push(event);
      this.dataSource.data = data;
    } else {
      this.dataSource = new MatTableDataSource(event);
    }
  }
  editComment() {}
  onSubmit() {
    const current = this.commentForm.value;
    const user = this.sessionService.getId();
    if (!this.isEdit) {
      const com = new EmployeeComment(
        '',
        this.employee.employeeId.toString(10),
        current.comment,
        new Date(),
        {
          _id: user,
          firstName: this.userFullName[0],
          lastName: this.userFullName[this.userFullName.length - 1],
        },
        this.employee._id
      );
      this.employeeService.saveComment(com).subscribe(
        (data) => {
          this.populateTable(data);
        },
        (error) => {}
      );
    } else {
      const com = new EmployeeComment(
        this.editCommentId,
        this.employee.employeeId.toString(10),
        current.comment,
        this.editCommentDate,
        {
          _id: user,
          firstName: this.userFullName[0],
          lastName: this.userFullName[this.userFullName.length - 1],
        },
        this.employee._id
      );
      this.employeeService.updateComment(com).subscribe(
        (data) => {},
        (error) => {}
      );
    }
  }
  clearForm() {
    this.commentForm.reset();
  }
}
