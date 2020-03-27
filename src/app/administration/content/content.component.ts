import { MatSnackBar } from "@angular/material/snack-bar";
import { Menu, MenuItems } from "./../../shared/menu-items/menu-items";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
})
export class ContentComponent implements OnInit {
  public menus: Menu[];
  public selectedMenu: Menu;
  constructor(private menuItem: MenuItems, private snackbar: MatSnackBar) {
    this.createSelectedItems();
  }
  ngOnInit() {}

  createSelectedItems() {
    const newMenu: Menu = {
      _id: "new",
      name: "Add new",
      state: "new",
      icon: "",
      type: "",
      children: [],
      page: null,
      position: null,
    };
    this.menuItem.getActiveMenus().subscribe((data: Menu[]) => {
      this.menus = data;
      this.selectedMenu = this.menus[0];
      this.menus.push(newMenu);
    });
  }
  onSave() {
    this.menuItem.save(this.selectedMenu);
    this.snackbar.open("New Menu Item was created", "Great! Thanks.", {
      duration: 500,
    });
    this.createSelectedItems();
  }
  onAdd() {
    this.menuItem.add(this.selectedMenu);
  }

  onAddSubmenu(name, state) {
    if (name !== "" && state !== "") {
      this.selectedMenu.children.push({ name: name, state: state });
    }
  }
  onDelete() {
    this.menuItem.delete(this.selectedMenu);
  }
}
