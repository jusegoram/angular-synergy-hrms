import { Pipe, PipeTransform } from '@angular/core';
import { TIME_VALUES } from '../../../environments/enviroment.common';

@Pipe({
  name: 'minuteSeconds',
})
export class MinuteSecondsPipe implements PipeTransform {
  transform(value: number): string {
    const time = value * TIME_VALUES.SECONDS_PER_HOUR;
    const hrs = ~~(time / TIME_VALUES.SECONDS_PER_HOUR);
    const mins = ~~((time % TIME_VALUES.SECONDS_PER_HOUR) / TIME_VALUES.SEXAGESIMAL_BASE);
    const secs = ~~time % TIME_VALUES.SEXAGESIMAL_BASE;

    const hrsString = hrs === 0 ? '00:' : hrs < 10 ? `0${hrs}:` : `${hrs}:`;
    const minsString = mins === 0 ? '00:' : mins < 10 ? `0${mins}:` : `${mins}:`;
    const secsString = secs === 0 ? '00' : secs < 10 ? `0${secs}` : `${secs}`;

    return hrsString + minsString + secsString;
  }
}
