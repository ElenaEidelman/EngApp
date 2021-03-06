import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { element, elementClassProp } from '@angular/core/src/render3';
import { GetDataService } from '../get-data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import * as XLSX from 'xlsx';
import { DmrList } from '../classes/dmrList';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent implements OnInit {

  constructor(
                private dataService: GetDataService,
                private dialog: MatDialog
              ) { }
  @Input() selection;
  @Input() displayedColumns;
  @Input() dataSource;
  @Input() displayedData;
  @Input() disableSelected;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  buttonName: string;
  archive:string;
  archionListFromDb;
  listToArchion = [];
  addList = new Set();
  setRemove = new Set();
  disabledList = new Set();
  linkEncrypt = "";
  scrapChecked = false;
  dataSourceSelectedByScrap;
  pageSizeOptions = [];



  ngOnInit() {
    setTimeout(() => {
      this.buttonName = this.disableSelected != false ? 'Save to Archive' : 'Delete from Archive';
      this.archive = this.disableSelected != false ? 'archive' : 'unarchive';
    },0);
    this.dataSource.paginator = this.paginator;
    // this.pageSizeOptions = [15,30,45,this.dataSource.data != undefined ? this.dataSource.data.length : null];
    this.pageSizeOptions = this.dataSource.data == undefined ? [] : this.dataSource.data.length > 15 ? [16,Math.ceil(this.dataSource.data.length / 4),Math.ceil(this.dataSource.data.length / 3),this.dataSource.data.length] : [this.dataSource.data.length];
    this.linkEncrypt = localStorage.getItem('Encrypt');
    let username = localStorage.getItem('user');
    this.archionList(this.displayedData, username);
    this.dataSourceSelectedByScrap = Object.create(this.dataSource);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    let dl = Array.from(this.disabledList);
    this.addList.forEach((el) => {
      //prevent removing from archion list if selected/deselected all
      if(this.disableSelected == true){
        if(dl.findIndex(dmrN => dmrN == el) == -1){
          this.setRemove.add(el);
         }
      }
      else{
        this.setRemove.add(el);
      }
    });
    this.addList.clear();
    this.isAllSelected() ?
        this.selection.clear():
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        this.addList.add(row.number);
      });

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  toogleRow(row: any, event) {
    if (event.checked) {
      this.addList.add(row.number);
      if (this.setRemove.has(row.number)) {
        this.setRemove.delete(row.number);
      }
    }
    else {
      this.addList.delete(row.number);
      this.setRemove.add(row.number);
    }
  }
  saveToArchion() {
    let username = localStorage.getItem('user');
    let tableName = this.displayedData;
    if (this.addList.size > 0 || this.setRemove.size >= 0) {
      this.listToArchion.push(Array.from(this.addList));
      this.listToArchion.push(Array.from(this.setRemove));
      this.listToArchion.unshift({ username: username, tableName: tableName });

      let tempSetToRemove = this.setRemove;
      this.dataService.saveToArchion(JSON.stringify(this.listToArchion)).subscribe(
        result => {
          if (result) {
            this.openDialog('Success', 'Archion list was changed');
            if(this.disableSelected == false){
              tempSetToRemove.forEach((id: string) => {
                document.getElementById(id).style.display = "none";
              });
            }
            this.listToArchion = [];
          }
          else {
            this.openDialog('Error', 'Something went wrong');
            this.listToArchion = [];
          }
        }
      );
    }
    else {
      this.openDialog('Error', 'Please do changes on the list');
    }
  }

  openDialog(title: string, message: string) {
    this.dialog.open(AlertDialogComponent, {
      width: "350px",
      data: { title: title, message: message }
    });
  }

  archionList(table: string, username) {
    let dataToDb = {
      table: table,
      username: username
    }
    this.dataService.getArchionList(dataToDb).subscribe(
      result => {
        let selectionArray = [];
        for (let num of Object.values(result)) {
          selectionArray.push(this.dataSource.data.find(dmrData => dmrData.number == num.listNumber));
          this.addList.add(num.listNumber);
          this.disabledList.add(num.listNumber);
        }
        // let d = this.dataSource.data;
        this.selection = new SelectionModel<DmrList>(true, selectionArray);
      }
    );

  }

  listNumber(number: number) {
    let listNumber;
    if (this.addList.has(number)) {
      listNumber = number;
    }
    return listNumber != undefined ? listNumber : 0;
  }

  //check if dmr in archion list
  checkedFromArchion(number: number) {
    if (this.disableSelected != false) {
      let disabled = false
      if (this.disabledList.has(number)) {
        disabled = true;
      }
      return disabled;
    }
  }


  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    let date = new Date();
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    let fileName = day + "-" + month + "-" + date.getFullYear() + "__" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "_" + this.displayedData
    XLSX.writeFile(wb, fileName + '.xlsx');

  }
  scrapSelected(event) {
    let filtered = [];
    if(event.checked){

      this.dataSource.data.forEach(element => {
        if(+element.scrap > 0){
          filtered.push(element);
        }
      });
      let obj = Object.create(DmrList);
      obj = filtered;
      this.dataSource = new MatTableDataSource<DmrList>(obj);
    }
    else{
      this.dataSource = this.dataSourceSelectedByScrap;
    }
  }

  linkTo(link){

  }

  checkTime(datetime: string){
    let date = datetime.split(' ')[0].split('/');
    let time = datetime.split(' ')[1].split(':');
    let oneHour = 60*60*1000;

    let dateMilisec = new Date(+('20' + date[2]),+date[1]-1,+date[0], +time[0],+time[1]).getTime();
    //let res = (new Date() - dateMilisec) < 60*60*1000;
    return (new Date().getTime() - dateMilisec) < oneHour;
  }
}
