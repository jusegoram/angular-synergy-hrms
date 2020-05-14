import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from '@synergy-app/shared/models';

@Component({
  selector: 'app-menu-selector',
  templateUrl: './menu-selector.component.html',
  styleUrls: ['./menu-selector.component.scss'],
})
export class MenuSelectorComponent implements OnInit {
  @Output() onMenuItemSelected = new EventEmitter<MenuItem>();
  @Input() menus: MenuItem[] = [];
  newMenuItem: MenuItem;

  constructor() {}

  ngOnInit(): void {
    this.newMenuItem = {
      _id: 'new',
      name: 'Add new',
      state: 'new',
      icon: '',
      type: '',
      children: [],
      page: null,
      position: null,
    };
    this.onMenuItemSelected.emit(this.newMenuItem);
  }

  setMenuItem(menuItem: MenuItem) {
    this.onMenuItemSelected.emit(menuItem);
  }
}
