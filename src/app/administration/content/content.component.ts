import { MenuItems, ChildrenItems } from './../../shared/menu-items/menu-items';
import { Menu } from './../../shared/menu-items/menu-items';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { noop } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  public menus: Menu[];
  public selectedMenu: Menu;
  constructor(private menuItem: MenuItems ) {
    this.createSelectedItems();
  }
  ngOnInit() {
  }

  createSelectedItems() {
    const newMenu: Menu = {
      _id: 'new', name: 'Add new', state: 'new', icon: '', type: '', children: [], roles: [], position: null
     };
     this.menuItem.getActiveMenus().subscribe((data: Menu[]) => {
       this.menus = data;
       this.selectedMenu = this.menus[0];
       this.menus.push(newMenu);
     });
  }
  onSave() {
    this.menuItem.save(this.selectedMenu);
    this.createSelectedItems();
  }
  onAdd() {
    this.menuItem.add(this.selectedMenu);
  }
  onAddRole(event) {
    const role = parseInt(event, 10);
    if (!this.selectedMenu.roles.includes(role)) {
      this.selectedMenu.roles.push(role);
      let roles = this.selectedMenu.roles;
      this.selectedMenu.roles = roles;
    }
  }
  onRemoveRole(event) {
    const role = parseInt(event, 10);
    if (this.selectedMenu.roles.includes(role)) {
      const i = this.selectedMenu.roles.indexOf(role);
      this.selectedMenu.roles.splice(i, 1);
    }

  }

  onAddSubmenu(name, state) {
    if (name !== '' && state !== '') {
      this.selectedMenu.children.push({name: name, state: state});
    }
  }
  onDelete() {
    this.menuItem.delete(this.selectedMenu);
  }
}
