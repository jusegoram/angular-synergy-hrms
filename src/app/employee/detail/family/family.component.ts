import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'family-info',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})
export class FamilyComponent implements OnInit {
  @Input() employeeId: string;
  @Input() authorization: boolean;
  constructor() { }

  ngOnInit() {
  }

}
