import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'avatar-detail',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() employeeId: string;
  @Input() authorization: boolean;
  constructor() { }

  ngOnInit() {
  }

}
