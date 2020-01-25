import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'hourFormat'
})
export class HourFormatPipe implements PipeTransform {

  transform(value: string): string {
    const totalMinutes = moment.duration(value).asMinutes();

    let hours = 0;
    let minutes = 0;

    if (totalMinutes) {
      hours = Math.floor(totalMinutes / 60);
      minutes = Math.floor(totalMinutes % 60);
    }

    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

}

