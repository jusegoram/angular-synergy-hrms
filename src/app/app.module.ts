import { SessionGuard } from './session/guards/session.guard';
import { SessionService } from './session/services/session.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialSharedModule } from './shared/material.shared.module';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { BidiModule } from '@angular/cdk/bidi';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SharedModule } from './shared/shared.module';
import { JwtModule } from '@auth0/angular-jwt';
import { GuardDialogComponent } from './session/guards/guard-dialog/guard-dialog.component';
import { RootGuard } from './session/guards/root.guard';


export function tokenGetter() {
  return localStorage.getItem('id_token');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    GuardDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes,
      {preloadingStrategy: PreloadAllModules}),
    FormsModule,
    HttpClientModule,
    MaterialSharedModule,
    BidiModule,
    PerfectScrollbarModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['192.168.100.4:3000'],
        authScheme: 'JWT '
      }
    }),
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    SessionService,
    SessionGuard,
    RootGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [GuardDialogComponent]
})
export class AppModule { }
