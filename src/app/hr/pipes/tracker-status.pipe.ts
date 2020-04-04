import { Pipe, PipeTransform } from '@angular/core';
import { TRACKER_STATUS_LABELS } from '../../../environments/environment';

@Pipe({
  name: 'trackerStatus',
  pure: true
})
export class TrackerStatusPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {   
    return TRACKER_STATUS_LABELS[value];
  }

}
