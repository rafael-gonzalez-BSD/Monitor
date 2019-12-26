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

    const dayRem = totalMinutes % 450;
    if (dayRem) {
      hours = Math.floor(dayRem / 60);
      minutes = Math.floor(dayRem % 60);
    }

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

}

