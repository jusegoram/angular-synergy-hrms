import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from '@synergy-app/shared/models';

@Component({
  selector: 'app-menu-items-editor',
  templateUrl: './sub-menu-items-editor.component.html',
  styleUrls: ['./sub-menu-items-editor.component.scss']
})
export class SubMenuItemsEditorComponent implements OnInit {
  @Input() selectedMenu: MenuItem;

  constructor() { }

  ngOnInit(): void {
  }

  onAddSubmenu(name, state) {
    if (name !== '' && state !== '') {
      this.selectedMenu.children.push({ name: name, state: state });
    }
  }

}
