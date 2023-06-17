import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'arrayFromSize'
})

export class ArrayFromSizePipe implements PipeTransform {
    transform(size: number, fromOne = false): number[] {
        const array: number[] = [];
        for (let index = fromOne ? 1 : 0; index <= size; index++) {
           array.push(index);
        };
        return array;
    }
}