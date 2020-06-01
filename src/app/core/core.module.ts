import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuardDialogComponent } from './containers/guard-dialog/guard-dialog.component';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { AdminLayoutComponent, AuthLayoutComponent } from './layouts';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@synergy-app/shared/shared.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20,
};

@NgModule({
  declarations: [GuardDialogComponent, AdminLayoutComponent, AuthLayoutComponent],
  imports: [CommonModule, SharedModule, MaterialSharedModule, HttpClientModule, PerfectScrollbarModule, RouterModule],
  exports: [AdminLayoutComponent, AuthLayoutComponent],
  entryComponents: [GuardDialogComponent],
  providers: [
    // SessionGuard,
    // RootGuard,
    // PrivilegeGuard,
    // SessionService,
    // EmployeeService,
    // AdminService,
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
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class CoreModule {}
