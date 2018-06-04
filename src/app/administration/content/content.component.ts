import { MenuItems } from './../../shared/menu-items/menu-items';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  public variable1 = false;
  public variable2 = 0;
  constructor(public menu: MenuItems) { }

  ngOnInit() {
  }
  onAddMenu() {
    this.menu.add();
  }

}
