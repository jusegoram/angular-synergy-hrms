import { MinuteSecondsPipe } from './../minute-seconds.pipe';
import { NgModule }      from '@angular/core';

 @NgModule({
     imports:        [],
     declarations:   [MinuteSecondsPipe],
     exports:        [MinuteSecondsPipe],
 })

 export class PipeModule {

   static forRoot() {
      return {
          ngModule: PipeModule,
          providers: [],
      };
   }
 }