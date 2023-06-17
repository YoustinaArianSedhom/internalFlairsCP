import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'NAReplacer',
})
export class NAReplacerPipe implements PipeTransform {

  transform(value: any, message?: string): any {
    if (value == null ) return message || 'N/A';
    return value;
  }

}
