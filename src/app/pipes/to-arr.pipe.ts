import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toArr'
})
export class ToArrPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    //debugger
    // let res = [ { controlname: "ont01", label: "ONT01", ischecked: false, child: null },
    //             { controlname: "smont011", label: "SMONT011", ischecked: false, child: null },
    //             { controlname: "ari01", label: "ARI01", ischecked: false, child: null },
    //             { controlname: "bxf72", label: "BXF72", ischecked: false, child: null },
    //             { controlname: "bxf74", label: "BXF74", ischecked: false, child: null },
    //             { controlname: "ntw01-6", label: "NTW01-6", ischecked: false, child: null },
    //             { controlname: "ntw01-7", label: "NTW01-7", ischecked: false, child: null }
    //       ]

    // let res = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
    let arr = [];
    value.forEach(element => {
      arr.push(element.controlname)
    });
    return arr.sort();
  }
}
