import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from '@synergy-app/shared/layouts/auth/auth-layout.component';
import { SessionGuard } from './session/guards/session.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [SessionGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./session/session.module').then((m) => m.SessionModule),
  },
  {
    path: '**',
    redirectTo: '/auth/404',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
