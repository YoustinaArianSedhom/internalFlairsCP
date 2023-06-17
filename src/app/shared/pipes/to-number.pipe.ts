import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toNumber'
})
export class ToNumberPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        if (isNaN(value)) return value;
        else return parseInt(value, 10);
    }
}
