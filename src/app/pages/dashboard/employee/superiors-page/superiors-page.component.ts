import { Component, OnInit } from '@angular/core';
import { SuperiorsService } from './services/superiors.service';
import { EmployeeService } from '@synergy-app/core/services';

@Component({
  selector: 'app-superiors',
  templateUrl: './superiors-page.component.html',
  styleUrls: ['./superiors-page.component.css'],
})
export class SuperiorsPageComponent implements OnInit {
  constructor(private _service: SuperiorsService, private _employee: EmployeeService) {}

  ngOnInit(): void {}
}
