import { Menu } from './../../shared/menu-items/menu-items';
import { Component, NgZone, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { SessionService } from '../../session/services/session.service';

const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  private _router: Subscription;

  mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
  today: number = Date.now();
  url: string;
  showSettings = false;
  dark: boolean;
  boxed: boolean;
  collapseSidebar: boolean;
  compactSidebar: boolean;
  currentLang = 'en';
  dir = 'ltr';
  sidePanelOpened;
  user;

  @ViewChild('sidemenu') sidemenu;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  public config: PerfectScrollbarConfigInterface = {};
  menus: Menu[];
  constructor(
    private router: Router, public menuItems: MenuItems, zone: NgZone, private sessionService: SessionService) {
    this.mediaMatcher.addListener(mql => zone.run(() => {
      this.mediaMatcher = mql;
    }));
  }

  ngOnInit(): void {
    this.menuItems.getActiveMenus().subscribe((menu) => this.menus = menu);
    this.url = this.router.url;
    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      document.querySelector('.app-inner > .mat-drawer-content > div').scrollTop = 0;
      this.url = event.url;
      this.runOnRouteChange();
    });
  }

  ngOnDestroy(): void  {
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver()) {
      this.sidemenu.close();
    }

    this.updatePS();
  }

  isOver(): boolean {
    if (this.url === '/apps/messages' ||
      this.url === '/apps/calendar' ||
      this.url === '/apps/media' ||
      this.url === '/maps/leaflet' ||
      this.url === '/taskboard') {
      return true;
    } else {
      return this.mediaMatcher.matches;
    }
  }

  menuMouseOver(): void {
    if (this.mediaMatcher.matches && this.collapseSidebar) {
      this.sidemenu.mode = 'over';
    }
  }

  menuMouseOut(): void {
    if (this.mediaMatcher.matches && this.collapseSidebar) {
      this.sidemenu.mode = 'side';
    }
  }

  updatePS(): void  {
    if (!this.mediaMatcher.matches && !this.compactSidebar) {
      setTimeout(() => {
        this.directiveScroll.update();
      }, 350);
    }
  }

  addMenuItem() {
    this.menuItems.add();
  }
  onLogout() {
    this.sessionService.authBS.next(false);
    this.sessionService.logout();
    this.router.navigateByUrl('/signin');
  }
}
