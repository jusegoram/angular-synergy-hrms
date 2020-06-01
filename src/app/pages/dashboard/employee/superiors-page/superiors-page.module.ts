import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperiorsPageRoutingModule } from './superiors-page-routing.module';
import { SuperiorsPageComponent } from './superiors-page.component';
import { SuperiorsService } from './services/superiors.service';


@NgModule({
  declarations: [SuperiorsPageComponent],
  imports: [
    CommonModule,
    SuperiorsPageRoutingModule
  ],
  providers: [SuperiorsService]
})
export class SuperiorsPageModule { }
