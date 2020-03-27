import {MinutesHoursPipe} from './../minutes-hours.pipe';
import {MinuteSecondsPipe} from './../minute-seconds.pipe';
import {NgModule} from '@angular/core';

@NgModule({
     imports:        [],
     declarations:   [MinuteSecondsPipe, MinutesHoursPipe],
     exports:        [MinuteSecondsPipe, MinutesHoursPipe],
 })

 export class PipeModule {

   static forRoot() {
      return {
          ngModule: PipeModule,
          providers: [],
      };
   }
 }
