import { Pipe, PipeTransform } from '@angular/core';
import { Filter } from '../classes/filter';

@Pipe({
  name: 'sortABC'
})
export class SortABCPipe implements PipeTransform {

  transform(value: any){

    let arr = [];
    value.forEach(element => {
      arr.push(element);
    });
    let arrABC = arr.sort((a, b) => (a.controlname > b.controlname) ? 1 : -1);
    return arrABC;
  }

}
