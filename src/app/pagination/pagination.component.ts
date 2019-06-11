import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  constructor() { }

  @Input() pager;
  // pagesArr = [];
  @Output() openCurrentPage: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    // this.pagesArr = Array.from(Array(Math.ceil(this.pages)).keys()).map(el => el + 1);
  }

  setCurrentPage(page: number){
    this.openCurrentPage.emit(page);
  }
}
