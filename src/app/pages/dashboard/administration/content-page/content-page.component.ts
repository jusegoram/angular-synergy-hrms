import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuService } from '@synergy-app/shared/services';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from '@synergy-app/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.scss'],
})
export class ContentPageComponent implements OnInit {
  public menus: MenuItem[];
  public selectedMenu: MenuItem;
  public selectedMenu$: Observable<MenuItem>;

  constructor(private menuItem: MenuService, private snackbar: MatSnackBar) {}
  ngOnInit() {
    this.createSelectedItems();
  }

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
    this.selectedMenu = newMenu;
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
      this.selectedMenu.children.push({ name: name, state: state });
    }
  }
  onDelete() {
    this.menuItem.delete(this.selectedMenu);
  }
}
