import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionRoutes } from './session.routing';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(SessionRoutes)],
  declarations: [],
})
export class SessionModule {}
