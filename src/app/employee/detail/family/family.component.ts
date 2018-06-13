import { Component, OnInit, Input } from '@angular/core';
import {Employee} from '../../Employee';

@Component({
  selector: 'family-info',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})
export class FamilyComponent implements OnInit {
  @Input() employee: Employee;
  @Input() authorization: boolean;
  constructor() { }

  ngOnInit() {
  }

}
