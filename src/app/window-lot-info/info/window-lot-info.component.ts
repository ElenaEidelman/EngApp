import { Component, OnInit, OnDestroy, HostListener, Directive, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { LotInfo } from 'src/app/classes/lotInfo';
import { MatTableDataSource } from '@angular/material';
import { LotHistory } from 'src/app/classes/lotHistory';
import { LotDmr } from 'src/app/classes/lotDmr';
import { LotSwr } from 'src/app/classes/lotSwr';
import { LotDcop } from 'src/app/classes/lotDcop';
import { LotProgress } from 'src/app/classes/lotProgress';
import { LotFutureHold } from 'src/app/classes/lotFutureHold';
import { GetDataService } from 'src/app/get-data.service';
import { FormControl, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StopNotice } from 'src/app/classes/lotStopNotice';
import { GenTableComponent } from 'src/app/gen-table/gen-table.component';




@Component({
  selector: 'app-window-lot-info',
  templateUrl: './window-lot-info.component.html',
  styleUrls: ['./window-lot-info.component.css']
})
export class WindowLotInfoComponent implements OnInit {

  constructor(
    private dataService: GetDataService,
    private router: Router
  ) { }

  @ViewChild(GenTableComponent) child:GenTableComponent;
  spinner: boolean = false;
  spinnerContent: boolean = false;
  // dataSource;
  // displayedColumns: string[] = [];
  noData: boolean = true;
  arrDataForTable;
  tableName = "";
  lotNumberToFind;
  lotNumber = new FormControl('', Validators.required);
  fromTableArr = [];
  noLotNumber: boolean = false;
  lotProgressCurrentStep = '';
  lotStatus = '';
  color: string = 'rgba(99, 132, 179, 0.5)';

  ngOnInit() {
    if (this.dataService.lotInfo != undefined) {
      this.lotNumber.setValue(this.dataService.lotInfo.lotNumber);
      this.arrDataForTable = this.dataService.lotInfo.lotData;
      let getStepForProgress = this.dataService.lotInfo.lotData.find(tbl => tbl.tableName == 'LotInfo');
      this.lotProgressCurrentStep = getStepForProgress.obj[0]["CURRENT_STEP"];
      this.lotStatus = getStepForProgress.obj[0]["STATUS"];
      this.lotInfo();
    }
    this.dataService.lotInfoData.subscribe(result => {
      if (Object.keys(result).length != 0) {
        this.lotNumber.setValue(result.lotNumber);
        this.arrDataForTable = result.lotData;
        this.lotInfo();
      }
    });

  }

  onSubmit() {
    if (this.lotNumber.valid) {
      //this.lotInfo();
      this.noLotNumber = false;
      this.getDataFromDb();
    }
    else {
      this.noLotNumber = true;
    }
  }

  lotInfo() {
    if (this.lotNumber.valid) {
      this.noLotNumber = false;
      this.fromTableArr = [];

      let globArr = [
        { lotClass: 'LotInfo' },
        { lotClass: 'LotDmr' },
        { lotClass: 'LotSwr' },
        { lotClass: 'LotFutureHold' },
        { lotClass: 'StopNotice' }
      ];

      globArr.forEach(element => {
        let data_source;
        let displayed_columns: string[] = [];
        let data = this.arrDataForTable.find(data => data.tableName == element.lotClass);
        let obj = data.obj;

        //let resultFromDb = await this.getDataFromDb(element.lotClass);


        switch (element.lotClass) {
          case 'LotInfo':
            data_source = new MatTableDataSource<LotInfo>(obj);
            break;
          case 'LotDmr':
            data_source = new MatTableDataSource<LotDmr>(obj);
            break;
          case 'LotSwr':
            data_source = new MatTableDataSource<LotSwr>(obj);
            break;
          case 'LotFutureHold':
            data_source = new MatTableDataSource<LotFutureHold>(obj);
            break;
          case 'StopNotice':
            data_source = new MatTableDataSource<StopNotice>(obj);
            break;
        }
        data.fieldsName.forEach(element => {
          displayed_columns.push(element);
        });
        this.fromTableArr.push({ dataSource: data_source, displayedColumns: displayed_columns, tableName: element.lotClass, lotProgressCurStep: this.lotProgressCurrentStep, lotStatus: this.lotStatus });

      });

    }
    else {
      this.noLotNumber = true;
    }
  }

  navigateAnchor(navigateTo: string) {
    if (this.lotNumber.valid) {
      this.noLotNumber = false;
      this.fromTableArr = [];
      this.lotInfo();
      setTimeout(() => {
        let anchor = document.getElementById(navigateTo);
        anchor.scrollIntoView();
      }, 0);
    }
    else {
      this.noLotNumber = true;
    }
  }

  navigateAnchorToRow(navigateTo: string){
    let anchor = document.getElementById(navigateTo);
    if(anchor != null){
      anchor.scrollIntoView({block: "center"});
    }
    else{
      let arr = navigateTo.split('-');
      let search = arr[arr.length - 2];
      this.child.applyFilter(search);
    }
    
  }
  getDataFromDb() {
    this.spinner = true;
    return this.dataService.getDataLotInfo(this.lotNumber.value).subscribe(result => {
      this.spinner = false;
      this.arrDataForTable = result;

      let resultToArr = Object.keys(result).map((k) => result[k]);
      let getStepForProgress = resultToArr.find(element => element.tableName == 'LotInfo');
      this.lotProgressCurrentStep = getStepForProgress.obj[0]["CURRENT_STEP"];
      let d = this.dataService.lotInfo.lotData.find(table => table);
      this.lotStatus = getStepForProgress.obj[0]["STATUS"];

      this.lotInfo();
    });
  }
  getData(tableName: string) {
    if (this.lotNumber.valid) {
      this.noLotNumber = false;
      this.spinnerContent = true;
      this.fromTableArr = [];
      let data_source;
      let displayed_columns: string[] = [];

      let data = this.arrDataForTable.find(data => data.tableName == tableName);
      let obj = data.obj;
      switch (tableName) {
        case 'LotDcop':
          data_source = new MatTableDataSource<LotDcop>(obj);
          break;
        case 'LotProgress':
          data_source = new MatTableDataSource<LotProgress>(obj);
          break;
        case 'LotHistory':
          data_source = new MatTableDataSource<LotHistory>(obj);
          break;
        case 'LotSwr':
          data_source = new MatTableDataSource<LotSwr>(obj);
          break;
        case 'LotFutureHold':
          data_source = new MatTableDataSource<LotFutureHold>(obj);
          break;
        case 'LotInfo':
          data_source = new MatTableDataSource<LotInfo>(obj);
          break;
        case 'LotDmr':
          data_source = new MatTableDataSource<LotDmr>(obj);
          break;
          
      }

      data.fieldsName.forEach(element => {
        displayed_columns.push(element);
      });

      this.fromTableArr.push({ tableName: tableName, displayedColumns: displayed_columns, dataSource: data_source, lotProgressCurStep: this.lotProgressCurrentStep, lotStatus: this.lotStatus });
      this.spinnerContent = false;
    }
    else {
      this.noLotNumber = true;
    }
  }
}

