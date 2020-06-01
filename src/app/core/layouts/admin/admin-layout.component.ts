import { filter } from 'rxjs/operators';
import { MenuItem } from '@synergy-app/shared/models';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuService } from '@synergy-app/shared/services/menu.service';
import { Subscription } from 'rxjs';

import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { SessionService } from '@synergy-app/core/services';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { TEMPERATURE_VALUES, TIME_VALUES } from '@synergy/environments/enviroment.common';

const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private _router: Subscription;

  mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
  today: number = Date.now();
  url: string;
  showSettings = false;
  weather: any;
  tempFahrenheit: number;
  weatherIcon: string;
  dark: boolean;
  boxed: boolean;
  collapseSidebar: boolean;
  compactSidebar: boolean;
  currentLang = 'en';
  dir = 'ltr';
  sidePanelOpened;
  user;

  @ViewChild('sidemenu', {static: true}) sidemenu;
  @ViewChild(PerfectScrollbarDirective, {static: true})
  directiveScroll: PerfectScrollbarDirective;

  public config: PerfectScrollbarConfigInterface = {};
  menus: MenuItem[];

  constructor(
    private router: Router,
    public menuService: MenuService,
    zone: NgZone,
    private sessionService: SessionService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {
    this.mediaMatcher.addListener((mql) => zone.run(() => {}));
    this.matIconRegistry.addSvgIcon(
      `icon-white`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/icon-white.svg')
    );
  }

  ngOnInit(): void {
    this.menuService.getActiveMenus().subscribe((menu) => {
      this.menus = menu.map((item) => {
        if (item.type === 'link') {
          item.state = decodeURI(item.state);
          item.state = item.state.split('/');
          item.state.unshift('/');
        }
        return item;
      });
    });
    this.url = this.router.url;
    this._router = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        document.querySelector('.app-inner > .mat-drawer-content > div').scrollTop = 0;
        this.url = event.url;
        this.runOnRouteChange();
      });
    this.sessionService.getWeather().subscribe((data) => {
      this.weather = data;
      this.switchWeatherIcon(this.weather.weather[0].icon);
      this.tempFahrenheit =
        (this.weather.main.temp - TEMPERATURE_VALUES.ZERO_KELVIN) * TEMPERATURE_VALUES.DEGREE_RATIO +
        TEMPERATURE_VALUES.FREEZING_POINT;
    });
  }

  ngOnDestroy(): void {
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver()) {
      this.sidemenu.close();
    }

    this.updatePS();
  }

  isOver(): boolean {
    if (
      this.url === '/apps/messages' ||
      this.url === '/apps/calendar' ||
      this.url === '/apps/media' ||
      this.url === '/maps/leaflet' ||
      this.url === '/taskboard'
    ) {
      return true;
    } else {
      return this.mediaMatcher.matches;
    }
  }

  switchWeatherIcon(icon) {
    switch (icon) {
      case '01d':
        this.weatherIcon = 'pe-is-w-sun-1';
        break;
      case '02d':
        this.weatherIcon = 'pe-is-w-partly-cloudy-1';
        break;
      case '03d':
        this.weatherIcon = 'pe-is-w-mostly-cloudy-1';
        break;
      case '04d':
        this.weatherIcon = 'pe-is-w-mostly-cloudy-2';
        break;
      case '09d':
        this.weatherIcon = 'pe-is-w-drizzle';
        break;
      case '10d':
        this.weatherIcon = 'pe-is-w-rain-day';
        break;
      case '11d':
        this.weatherIcon = 'pe-is-w-thunderstorm-day-2';
        break;
      case '13d':
        break;
      case '50d':
        this.weatherIcon = 'pe-is-w-fog-3';
        break;

      case '01n':
        this.weatherIcon = 'pe-is-w-full-moon-3';
        break;
      case '02n':
        this.weatherIcon = 'pe-is-w-partly-cloudy-2';
        break;
      case '03n':
        this.weatherIcon = 'pe-is-w-mostly-cloudy-1';
        break;
      case '04n':
        this.weatherIcon = 'pe-is-w-mostly-cloudy-2';
        break;
      case '09n':
        this.weatherIcon = 'pe-is-w-drizzle';
        break;
      case '10n':
        this.weatherIcon = 'pe-is-w-rain-night';
        break;
      case '11n':
        this.weatherIcon = 'pe-is-w-thunderstorm-night-2';
        break;
      case '13n':
        break;
      case '50n':
        this.weatherIcon = 'pe-is-w-fog-4';
        break;
      default:
        this.weatherIcon = 'pe-is-w-sun-1';
        break;
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

  updatePS(): void {
    if (!this.mediaMatcher.matches && !this.compactSidebar) {
      setTimeout(() => {
        this.directiveScroll.update();
      }, TIME_VALUES.SHORT_TIME_TO_WAIT);
    }
  }

  onLogout() {
    this.sessionService.logout();
    this.router.navigateByUrl('/auth/signin');
  }

  onProfile() {
    this.router.navigateByUrl('/user/profile');
  }
}
