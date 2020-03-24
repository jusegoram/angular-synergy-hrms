import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

  transform(value: number): string {
    const time = value * 3600;
    const hrs = ~~(time / 3600);
    const mins = ~~((time % 3600) / 60);
    const secs = ~~time % 60;

    const hrsString = (hrs === 0)? '00:' : hrs < 10 ? `0${hrs}:`: `${hrs}:`
    const minsString = (mins === 0)? '00:' : mins < 10 ? `0${mins}:`: `${mins}:`
    const secsString = (secs === 0)? '00' : secs < 10 ? `0${secs}`: `${secs}`

    return hrsString + minsString + secsString;
  }

}
