import { Component, OnInit, Input } from '@angular/core';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { element } from '@angular/core/src/render3';
import { GetDataService } from '../get-data.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component'


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(
            private dataService: GetDataService,
            private dialog: MatDialog) { }
  @Input() selection;
  @Input() displayedColumns;
  @Input() dataSource;
  @Input() displayedData;
  archionListFromDb;
  listToArchion = [];
  addList = new Set();
  setRemove = new Set();
  


  ngOnInit() {
    let username = localStorage.getItem('user');
    this.archionList(this.displayedData,username);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // this.listToArchion = [];
    this.addList.forEach((el)=>{
      this.setRemove.add(el); 
    });
    this.addList.clear();
    
    this.isAllSelected() ?
      this.selection.clear():
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        // this.listToArchion.push(row);
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
    debugger
    if(event.checked){
      // this.listToArchion.push(row.number);
      this.addList.add(row.number);
      if(this.setRemove.has(row.number)){
        this.setRemove.delete(row.number);
      }
    }
    else{
      this.addList.delete(row.number);
      this.setRemove.add(row.number);
    }
  }
  saveToArchion() {
    let username = localStorage.getItem('user');
    let tableName = this.displayedData;
    console.log(this.addList);
    console.log(this.setRemove);
    if(this.addList.size > 0 || this.setRemove.size >= 0){
      this.listToArchion.push(Array.from(this.addList));
      this.listToArchion.push(Array.from(this.setRemove));
      this.listToArchion.unshift({username:username, tableName:tableName});
      debugger
      this.dataService.saveToArchion(JSON.stringify(this.listToArchion)).subscribe(
        result => {
          if(result){
            this.openDialog('Success','Archion list was changed');
            this.listToArchion = [];
          }
          else{
            this.openDialog('Error','Something went wrong');
            this.listToArchion = [];
          }
        }
      );
    }
    else{
      this.openDialog('Error','Please do changes on the list');
    }
  }

  openDialog(title: string, message:string){
    this.dialog.open(AlertDialogComponent,{
      width:"350px",
      data:{title:title,message:message}
    });
  }

  archionList(table: string, username){
    let dataToDb = {
      table:table,
      username:username
    }
    this.dataService.getArchionList(dataToDb).subscribe(
      result => {
        for(let num of Object.values(result)){
          this.addList.add(num.listNumber);
          //this.listToArchion.push(num.listNumber);
        }
      }
    );
  }

  listNumber(number:number){
    let listNumber;
      if(this.addList.has(number)){
        listNumber = number;
      }
    return listNumber != undefined ? listNumber : 0;
  }

  

}
