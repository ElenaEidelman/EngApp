import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addSpace'
})
export class AddSpacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.replace(/([A-Z])/g, ' $1').trim();
  }

}
