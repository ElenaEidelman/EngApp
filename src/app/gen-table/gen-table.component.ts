import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-gen-table',
  templateUrl: './gen-table.component.html',
  styleUrls: ['./gen-table.component.css']
})
export class GenTableComponent implements OnInit {

  constructor() { }
  @Input() displayedColumns;
  @Input() dataSource;
  @Input() tableName;
  @Input() lotProgressStep;
  @Input() lotStatus;
  @Input() indexStepProgressLot;
  noRecipe: string = '';
  filter;


  pageMinSize: number = 15;

  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions = [];



  ngOnInit() {
    // this.pageSizeOptions = [15,30,45,this.dataSource.data.length];
    this.pageSizeOptions = this.dataSource.data == undefined ? [] : this.dataSource.data.length > this.pageMinSize ? [this.pageMinSize + 1, Math.ceil(this.dataSource.data.length / 4), Math.ceil(this.dataSource.data.length / 3), this.dataSource.data.length] : [this.dataSource.data.length];
    this.dataSource.paginator = this.paginator;

    // this.lotProgressStep = this.lotProgressStep.split('-');
  }
  goTo() {

    if (this.dataSource.data.length > this.pageMinSize) {
      // let arr = [16, Math.ceil(this.dataSource.data.length / 4), Math.ceil(this.dataSource.data.length / 3), this.dataSource.data.length];
      // let pi = arr.find(el => el > this.indexStepProgressLot);
      let goToIndex = Math.floor(this.indexStepProgressLot / this.paginator.pageSize);
      goToIndex == -1 ? this.noRecipe = 'No current recipe' : this.noRecipe = '';
      this.paginator.pageIndex = goToIndex;
      this.paginator.page.next({
        pageIndex: goToIndex,
        pageSize: this.dataSource.data.length,
        length: this.paginator.length
      });
    }
    setTimeout(() => {
      document.getElementById(this.lotProgressStep + '-' + this.tableName).scrollIntoView({ block: 'center' });
    }, 0);
  }

  applyFilter(filterValue: string) {
    if (filterValue == '') {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.filter = '';
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  goToId(id: string) {
    let goToDomEl = document.getElementById(id);
    goToDomEl.scrollIntoView();
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    let date = new Date();
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    let fileName = day + "-" + month + "-" + date.getFullYear() + "__" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "_" + this.tableName
    XLSX.writeFile(wb, fileName + '.xlsx');

  }

  setColors(tableObj, elementTableObj) {
    let classes = {};
    if (tableObj == 'STATUS' && elementTableObj == 'HOLD') {
      classes = {
        redColor: true,
        yellowColor: false,
        greenColor: false
      }
    }
    else if (tableObj == 'STATUS' && elementTableObj == 'RUN') {
      classes = {
        redColor: false,
        yellowColor: false,
        greenColor: true
      }
    }
    else if (tableObj == 'STATUS' && elementTableObj == 'WAIT') {
      classes = {
        redColor: false,
        yellowColor: true,
        greenColor: false
      }
    }

    return classes;
  }

  rowColor(tableName, id) {
    if (tableName == 'LotProgress' && id == this.lotProgressStep + '-' + tableName) {
      switch (this.lotStatus) {
        case 'HOLD': return 'colorRedRow';
        case 'RUN': return 'colorGreenRow';
        case 'WAIT': return 'colorYellowRow';
      }
    }
  }
}
