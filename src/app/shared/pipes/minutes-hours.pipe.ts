import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesHours',
})
export class MinutesHoursPipe implements PipeTransform {
  transform(value: number): string {
    const sexagesimalBase = 60;

    const time = value;
    const hrs = ~~(time / sexagesimalBase);
    const mins = ~~(time % sexagesimalBase);

    const hrsString = hrs === 0 ? '00:' : hrs < 10 ? `0${hrs}:` : `${hrs}:`;
    const minsString = mins === 0 ? '00' : mins < 10 ? `0${mins}` : `${mins}`;

    return hrsString + minsString;
  }
}
