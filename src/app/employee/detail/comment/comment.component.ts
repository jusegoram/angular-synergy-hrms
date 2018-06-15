import {Component, Input, OnInit} from '@angular/core';
import {Employee} from '../../Employee';

@Component({
  selector: 'comment-info',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() employee: Employee;
  @Input() authorization: boolean;
  dataSource: any;
  displayedColumns = ['comment', 'by', 'date'];
  constructor() { }

  ngOnInit() {
  }

}
