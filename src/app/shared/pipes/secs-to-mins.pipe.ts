import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secsToMins'
})
export class SecsToMinsPipe implements PipeTransform {

  transform(value: number, type?: string): string | number {
    if (isNaN(value)) return value;
    const minutes: number = Math.floor(value / 60);
    const seconds: number = (value - minutes * 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${type || ''}`;
  }

}
