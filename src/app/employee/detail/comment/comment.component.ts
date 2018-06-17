import {Component, Input, OnInit} from '@angular/core';
import {Employee, EmployeeComment} from '../../Employee';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'comment-info',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() employee: Employee;
  @Input() authorization: boolean;
  dataSource: any;
  public isEdit: false;
  employeeComment: any;
  editCommentId: string;
  editCommentDate: Date;
  displayedColumns = ['comment', 'by', 'date'];
  public commentForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private employeeService: EmployeeService) { }

  ngOnInit() {
    this.employeeComment = this.employee.comments;
  }
  buildForms() {

  }

  populateTable(event: any) {
    if (this.dataSource) {
      const data = this.dataSource.data;
      data.push(event);
      this.dataSource.data = data;
      console.log(this.dataSource.data);
    } else { this.dataSource = new MatTableDataSource(event); }
  }
  editComment() {

  }
  onSubmit() {
    let current = this.commentForm.value;
    let user = localStorage.getItem('userId');
    if (!this.isEdit) {
      let com = new EmployeeComment(
        '',
        this.employee.employeeId.toString(10),
        current.comment,
        new Date(),
        user,
        this.employee._id );
      this.employeeService.saveComment(com).subscribe(data => {}, error => {});
    }else {
      let com = new EmployeeComment(
        this.editCommentId,
        this.employee.employeeId.toString(10),
        current.comment,
        this.editCommentDate,
        user,
        this.employee._id
    );
      this.employeeService.updateComment(com).subscribe(data => {}, error => {});
    }

  }
  clearForm() {
    this.commentForm.reset();
  }
}
