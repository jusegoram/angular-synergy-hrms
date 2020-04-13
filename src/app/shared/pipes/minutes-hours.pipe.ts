import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'minutesHours',
})
export class MinutesHoursPipe implements PipeTransform {
  transform(value: number): string {
    const time = value;
    const hrs = ~~(time / 60);
    const mins = ~~(time % 60);

    const hrsString = hrs === 0 ? '00:' : hrs < 10 ? `0${hrs}:` : `${hrs}:`;
    const minsString = mins === 0 ? '00' : mins < 10 ? `0${mins}` : `${mins}`;

    return hrsString + minsString;
  }
}
