import { Component, OnInit } from '@angular/core';
import { GetDataService } from 'src/app/get-data.service';
import { map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { DmrList } from 'src/app/classes/dmrList';
import { MatTableDataSource } from '@angular/material';
import { debug } from 'util';

@Component({
  selector: 'app-archion',
  templateUrl: './archion.component.html',
  styleUrls: ['./archion.component.css']
})
export class ArchionComponent implements OnInit {

  constructor(
    private dataService: GetDataService
  ) { }

  tabsArr = [];
  selection = new SelectionModel<DmrList>(true, []);
  displayedColumns: string[] = [];
  noData: boolean = false;
  dmrsData;
  dataSource;
  ngOnInit() {
    this.getArchion();
  }

  getArchion() {
    let username = localStorage.getItem('user');
    let sortingTable = [];
    let dataToDb = {
      table: 'Jet\',\'Department\',\'WaitingFor\',\'ByMonth\',\'Global',
      username: username
    }
    this.dataService.getArchionList(dataToDb).subscribe(
      result => {
        if (Object.keys(result).length > 0) {
          //create arr with tables for tab
          let tabs = new Set();
          for (var table in result) {
            tabs.add(result[table]['table']);
          }

          //spread dmrs over the table
          Array.from(tabs).forEach(element => {
            let dmrNums = [];
            for (var el in result) {
              if (result[el]['table'] == element) {
                dmrNums.push(result[el]['listNumber']);
              }
            }
            sortingTable.push({ table: element, dmrNums: dmrNums });
            dmrNums = [];
          });

          let dataToDb = {
            dataBy: 'Number',
            archionList: result
          }
          this.dataService.getDmrsList(JSON.stringify(dataToDb)).subscribe(
            dmrsList => {
              let arrR ;
              let dmrListKeys = Object.keys(dmrsList);
              let obj = Object.create(DmrList);
              if (dmrListKeys.length > 0) {
                arrR = dmrListKeys.map(k => dmrsList[k]);

                //create displayedColumns
                this.displayedColumns.push('select');
                Object.keys(dmrsList[0]).forEach((item) => {
                  this.displayedColumns.push(item);
                });

                //create sortingTable
                sortingTable.forEach((element, i) => {
                  element['dmrNums'].forEach((dmrN, index) => {
                    let ind = sortingTable[i]['dmrNums'].findIndex(i => i == dmrN);
                    sortingTable[i]['dmrNums'][ind] = arrR.find(x => x.number == dmrN);
                  });
                });
                this.tabsArr = sortingTable;

                //convert to MatTableDataSource objects
                for (let d in sortingTable) {
                  obj = sortingTable[d]['dmrNums'];
                  sortingTable[d]['dmrNums'] = new MatTableDataSource<DmrList>(obj);
                }
              }
              else {
                this.noData = true;
              }
            }
          );
        }
      }
    )
  }

  //check master check if all selected
  tabClicked(dmrCat){
    let arrToSelection = this.tabsArr.find(dmrListsArr => dmrListsArr.table == dmrCat['tab']['textLabel']).dmrNums.filteredData;
    this.selection  = new SelectionModel<DmrList>(true, arrToSelection);
  }
}
