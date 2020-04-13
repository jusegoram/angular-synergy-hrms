import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds',
})
export class MinuteSecondsPipe implements PipeTransform {
  transform(value: number): string {
    const secondsPerHour = 3600;
    const sexagesimalBase = 60;

    const time = value * secondsPerHour;
    const hrs = ~~(time / secondsPerHour);
    const mins = ~~((time % secondsPerHour) / sexagesimalBase);
    const secs = ~~time % sexagesimalBase;

    const hrsString = hrs === 0 ? '00:' : hrs < 10 ? `0${hrs}:` : `${hrs}:`;
    const minsString = mins === 0 ? '00:' : mins < 10 ? `0${mins}:` : `${mins}:`;
    const secsString = secs === 0 ? '00' : secs < 10 ? `0${secs}` : `${secs}`;

    return hrsString + minsString + secsString;
  }
}
