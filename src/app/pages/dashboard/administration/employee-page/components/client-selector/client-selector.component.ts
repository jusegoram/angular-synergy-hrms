import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Client } from '@synergy-app/shared/models/positions-models';

@Component({
  selector: 'app-client-selector',
  templateUrl: './client-selector.component.html',
  styleUrls: ['./client-selector.component.scss'],
})
export class ClientSelectorComponent implements OnInit {
  @Input() clients: Client[];
  @Input() defaultSelectedItem: Client;
  @Output() onClientSelected = new EventEmitter<Client>();
  @Output() onSelectorItemClicked = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}
}
