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
    this.populateTable(this.employeeComment);
    this.buildForms();
  }
  buildForms() {
    this.commentForm = this.fb.group({
      comment: ['']
    });
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
    const current = this.commentForm.value;
    const user = localStorage.getItem('userId');
    if (!this.isEdit) {
      const com = new EmployeeComment(
        '',
        this.employee.employeeId.toString(10),
        current.comment,
        new Date(),
        user,
        this.employee._id );
      this.employeeService.saveComment(com).subscribe(data => {
        console.log('success:' + data);
        this.populateTable(data);
      }, error => {});
    }else {
      const com = new EmployeeComment(
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
