import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuService } from '@synergy-app/shared/services/menu.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from '@synergy-app/shared/models';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  public menus: MenuItem[];
  public selectedMenu: MenuItem;

  constructor(private menuItem: MenuService, private snackbar: MatSnackBar) {
    this.createSelectedItems();
  }
  ngOnInit() {}

  createSelectedItems() {
    const newMenu: MenuItem = {
      _id: 'new',
      name: 'Add new',
      state: 'new',
      icon: '',
      type: '',
      children: [],
      page: null,
      position: null,
    };
    this.menuItem.getActiveMenus().subscribe((data: MenuItem[]) => {
      this.menus = data;
      this.selectedMenu = this.menus[0];
      this.menus.push(newMenu);
    });
  }
  onSave() {
    this.menuItem.save(this.selectedMenu);
    this.snackbar.open('New Menu Item was created', 'Great! Thanks.', {
      duration: 500,
    });
    this.createSelectedItems();
  }

  onAdd() {
    this.menuItem.add(this.selectedMenu);
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
