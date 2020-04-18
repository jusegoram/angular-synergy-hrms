import { SessionGuard } from './pages/session/guards/session.guard';
import { SessionService } from './shared/services/session.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialSharedModule } from './shared/material.shared.module';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule, } from 'ngx-perfect-scrollbar';
import { BidiModule } from '@angular/cdk/bidi';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './shared/layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './shared/layouts/auth/auth-layout.component';
import { SharedModule } from '@synergy-app/shared/shared.module';
import { GuardDialogComponent } from '@synergy-app/pages/session/guards/guard-dialog/guard-dialog.component';
import { RootGuard } from '@synergy-app/pages/session/guards/root.guard';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { AuthenticationInterceptor } from './shared/interceptors/authentication.interceptor';
import { EmployeeService } from './shared/services/employee.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20,
};

@NgModule({
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent, GuardDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    HttpClientModule,
    MaterialSharedModule,
    BidiModule,
    PerfectScrollbarModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    SessionService,
    SessionGuard,
    RootGuard,
    EmployeeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [GuardDialogComponent],
})
export class AppModule {}
