import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user.routing';
import { CompareValidatorDirective } from './directives/compare-validator.directive';

@NgModule({
  imports: [CommonModule, UserRoutingModule],
  declarations: [CompareValidatorDirective],
  providers: [],
})
export class UserModule {}
