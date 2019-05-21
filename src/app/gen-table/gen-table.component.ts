import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';

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
  @ViewChild('TABLE') table: ElementRef;

  ngOnInit() {
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
}
