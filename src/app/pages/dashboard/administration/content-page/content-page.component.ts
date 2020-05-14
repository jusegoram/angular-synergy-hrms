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
  public menus$: Observable<MenuItem[]>;
  public selectedMenu: MenuItem;
  public selectedMenu$: Observable<MenuItem>;

  constructor(private menuItemService: MenuService, private snackbar: MatSnackBar) {}
  ngOnInit() {
    this.fetchMenuItems();
  }

  fetchMenuItems() {
    this.menus$ = this.menuItemService.getActiveMenus();
  }

  setSelectedMenuItem(menuItem: MenuItem) {
    this.selectedMenu = menuItem;
  }

  async onSave() {
    try {
      await this.menuItemService.saveMenu(this.selectedMenu).toPromise();
      this.snackbar.open('New Menu Item was created', 'Great! Thanks.', {
        duration: 500,
      });
      this.fetchMenuItems();
    } catch (error) {}
  }

  onAdd() {
    this.menuItemService.add(this.selectedMenu);
  }

  onDelete() {
    this.menuItemService.delete(this.selectedMenu);
  }
}
