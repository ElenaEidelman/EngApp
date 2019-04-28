import { Component, OnInit } from '@angular/core';
import { GetDataService } from 'src/app/get-data.service';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { DmrList } from 'src/app/classes/dmrList';


@Component({
  selector: 'app-dmr-waitingfor',
  templateUrl: './dmr-waitingfor.component.html',
  styleUrls: ['./dmr-waitingfor.component.css']
})
export class DmrWaitingforComponent implements OnInit {

  constructor(
    private dataService: GetDataService
  ) { }
  selection = new SelectionModel<DmrList>(true, []);
  displayedColumns: string[] = [];
  dataSource;
  noData: boolean = false;
  displayedData = "WaitingFor";

  // dmrsData;


  ngOnInit() {
    this.getWaitingForDmrs();
  }

  getWaitingForDmrs() {
    let userData = JSON.parse(localStorage.getItem("userDetails"));
    let badge = +userData["badge"];
    let dataToDb = {
      dataBy: 'WaitingFor',
      badge: badge
    }

    this.dataService.getDmrsList(JSON.stringify(dataToDb)).subscribe(
      result => {
        debugger
        if (Object.keys(result).length > 0) {
          // this.dmrsData = result;
          let obj = Object.create(DmrList);
          obj = result;
          //debugger
          this.dataSource = new MatTableDataSource<DmrList>(obj);
          this.displayedColumns.push('select');
          //debugger
          Object.keys(obj[0]).forEach((item) => {
            this.displayedColumns.push(item);
          });

        }
        else {
          this.dataSource = [];
          this.noData = true;
        }
      }
    );
  }
}
