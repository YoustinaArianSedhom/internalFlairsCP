import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundNumber'
})
export class RoundNumberPipe implements PipeTransform {

  transform(value: any, ...args: any[]): number {
    return Math.floor(Math.round(value));
  }

}
