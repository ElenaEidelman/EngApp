import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagingService {

  constructor() { }


  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 5){
    //pageSize - how many items on the page
    //totalPages - how many pages need to all items
    let totalPages: number = Math.ceil(totalItems / pageSize);

    //ensure that this do not out of bounds
    if(currentPage < 1){
      currentPage = 1;
    }
    else if(currentPage > totalPages){
      currentPage = totalPages;
    }

    let startPage: number;
    let endPage: number;

    if(totalPages <= 5){
      startPage = 1;
      endPage = totalPages;
    }
    else{
      //if more that 5 pages
      if(currentPage <= 2){
        startPage = 1;
        endPage = 5;
      }
      else if(currentPage + 4 >= totalPages){
        startPage = totalPages - 4;
        endPage = totalPages;
      }
      else{
        startPage = currentPage - 1;
        endPage = currentPage + 3;
      }
    }
    //calculate start and end index items
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min((startIndex + pageSize - 1), (totalItems - 1));

    //create and array of pages
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
}
