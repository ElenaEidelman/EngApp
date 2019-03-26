import { Pipe, PipeTransform } from '@angular/core';
import { Filter } from '../classes/filter';

@Pipe({
  name: 'sortABC'
})
export class SortABCPipe implements PipeTransform {

  transform(filter:Filter[]){

    // debugger

    // if (filter != null){
    //   return filter.sort((a, b) => {
    //     if(a.controlname < b.controlname) { return -1; }
    //     if(a.controlname > b.controlname) { return 1; }
    //     return 0;
    // })
    // }
  }

}
