import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { DmrList } from 'src/app/classes/dmrList';
import { FormBuilder, FormArray } from '@angular/forms';
import { GetDataService } from 'src/app/get-data.service';
import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { PagingService } from 'src/app/paging.service';


@Component({
  selector: 'app-dmrsearch',
  templateUrl: './dmrsearch.component.html',
  styleUrls: ['./dmrsearch.component.css']
})
export class DmrsearchComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dataService: GetDataService,
    private dialog: MatDialog,
    private pagingService: PagingService
  ) {
   }
  areaArr = ['ALL', 'FAB', 'SORT'];
  locationArr = [];
  statusArr = ['ALL', 'OP', 'CL', 'DL', 'REOP'];
  dmrType = ['ALL', 'FRONT END', 'BACK END', 'RMR'];
  yesNoSelection = ['ALL', 'Y', 'N'];
  titlesArr = ['ALL', 'CAL', 'CUS SUPPORT', 'ENG', 'ENG DEV', 'ENG DEV RD', 'ENG SH', 'ENG SORT', 'ENG TEST', 'ENG WLR', 'EODMR', 'ERS SH', 'ERS TECH', 'GF', 'MNGR', 'OP', 'PRT', 'QA', 'REL', 'SP', 'SPRT GRP', 'SV', 'SV TEST', 'SYS', 'TRAIN', 'YE'];
  waitingForArr = [];
  categoryArr = [];
  defectGroup1Arr = [];
  defectGroup2Arr = [];
  equipmentArr = [];

  selectedDefectGroup1;
  selectedDefectGroup2;
  selectedEquipments;
  selectedWaitingFor;
  selectedTitels;
  selectedLocations;
  viewItemsOnPaging: number = 20;

  pagerEquipment:any = {};
  pagerWaitingFor:any = {};
  pagerTitels:any = {};
  pagerDefectGroup1:any = {};
  pagerDefectGroup2:any = {};

  dmrSearchForm = this.fb.group({
    LotNumber: [''],
    Product: [''],
    DmrNumber: [''],
    Description: [''],
    Area: ['ALL'],
    Location: [['ALL']],
    Status: [['ALL']],
    Title: [['ALL']],
    DateFrom: [''],
    DateTo:[''],
    Equipment: [['ALL']],
    Category: ['ALL'],
    Defect1: ['ALL'],
    Defect2: ['ALL'],
    DmrType: ['ALL'],
    WaitingFor: [['ALL']],
    Formal8D: ['ALL'],
    Mrb: ['ALL'],
    Tjcn: ['ALL'],
    WaiverSolaN: ['ALL']
  });

  selection = new SelectionModel<DmrList>(true, []);
  displayedColumns: string[] = [];
  dataSource;
  noData: boolean = true;
  dmrsData;
  displayedData = "Global";
  spinner: boolean = false;
  username;
  ngOnInit() {
    this.username = localStorage.getItem('user');
    this.getLocations();
    this.getData();
  }

  getLocations() {
    this.dataService.listOfNestedBlock(this.username).then(
      result => {
        this.locationArr.push('ALL');
        Object.entries(result['jets']).map(loc => {
          this.locationArr.push(loc[1]['controlname']);
        });
        this.locationArr = this.locationArr.sort((a, b) => (a > b) ? 1 : -1);
      }
    );
  }

  //users, equipment, defect group1, defect group2, category
  getData() {
    this.dataService.getDataForGlobalSearch().subscribe(data => {
      this.waitingForArr = data['users'].sort((a, b) => a.nameAndLname > b.nameAndLname ? 1 : -1);
      this.waitingForArr.unshift({badge:'ALL', nameAndLname: 'ALL'});

      this.categoryArr = data['category'].sort((a, b) => a > b ? 1 : -1);
      this.categoryArr.unshift('ALL');

      this.defectGroup1Arr = data['defG1'].sort((a, b) => a > b ? 1 : -1);
      this.defectGroup1Arr.unshift('ALL');

      this.defectGroup2Arr = data['defG2'].sort((a, b) => a > b ? 1 : -1);
      this.defectGroup2Arr.unshift('ALL');

      this.equipmentArr = data['equipment'].sort((a, b) => a > b ? 1 : -1);
      this.equipmentArr.unshift('ALL');


      // this.selectedEquipments = this.equipmentArr.slice(0,10);
      this.openCurrentPage(1,'selectedEquipments','equipmentArr','pagerEquipment');
      // this.selectedDefectGroup1 = this.defectGroup1Arr;
      this.openCurrentPage(1,'selectedDefectGroup1','defectGroup1Arr','pagerDefectGroup1');
      this.selectedDefectGroup2 = this.defectGroup2Arr;
      this.openCurrentPage(1,'selectedDefectGroup2','defectGroup2Arr','pagerDefectGroup2');
      // this.selectedWaitingFor = this.waitingForArr;
      this.openCurrentPage(1,'selectedWaitingFor','waitingForArr','pagerWaitingFor');
      // this.selectedTitels = this.titlesArr;
      this.openCurrentPage(1,'selectedTitels','titlesArr','pagerTitels');
      this.selectedLocations = this.locationArr;

    });
  }

  applyFilter(selected,dataArr,filterValue: string, objProperty?: string){
    let result = this.select(dataArr,filterValue,objProperty);
    this[selected] = result;
  }

  select(control: string, query: string, objProperty?: string):string[]{
    let result: string[] = [];
    for(let a of this[control]){
      if(typeof a == 'object'){
        if(a[objProperty].toLowerCase().indexOf(query) > -1){
          result.push(a)
        }
      }else{
        if(a.toLowerCase().indexOf(query) > -1){
          result.push(a)
        }
      }
    }
    return result
  }

  change(controler, event) {

    //if selected ALL
    if (event['isUserInput'] && event['source']['_selected'] && event['source'].value == 'ALL') {
      this.dmrSearchForm.get(controler).patchValue(['']);

    }

    //if selected something else
    else if (event['isUserInput'] && event['source']['_selected'] && event['source'].value != 'ALL') {
      let ALLexist = this.dmrSearchForm.get(controler).value;
      if (ALLexist.findIndex(c => c == 'ALL') != -1) {
        this.dmrSearchForm.get(controler).patchValue([event['source'].value]);
      }
    }

    //if deselect
    else if (event['isUserInput'] && !event['source']['_selected']) {
      let countOfSelected = this.dmrSearchForm.get(controler).value.length;
      //if deselected last child
      if (countOfSelected == 1) {
        this.dmrSearchForm.get(controler).patchValue(['ALL']);
      }
    }
  }
  onSubmit() {
    let formControls = this.dmrSearchForm;
    let valid:boolean = false;
    for(let control of Object.keys(formControls.controls)){
      if(formControls.get(control).value == 'ALL' || formControls.get(control).value == ''){
        valid = false;
      }
      else{
        valid = true;
        break;
      }
    }

    if(valid){  
      this.spinner = true;
      let dataToDb = {
        dataBy: 'Global',
        globalSearch: this.dmrSearchForm.value
      }
      this.dataService.getDmrsList(JSON.stringify(dataToDb)).subscribe(result => {
        document.getElementById('tabledata').scrollIntoView();
          if(Object.keys(result).length == 0){
            this.dataSource = [];
            this.displayedColumns = [];
            this.noData = true;
          }
          else{
            this.noData = false;
            this.dmrsData = result;
            let obj = Object.create(DmrList);
            obj = result;
            this.dataSource = new MatTableDataSource<DmrList>(obj);
            // to prevent duplicat columns
            if(this.displayedColumns.indexOf('select') == -1){
              this.displayedColumns.push('select');
              Object.keys(obj[0]).forEach((item)=>{
                this.displayedColumns.push(item);
              });
            }
          }
          this.spinner = false;
      });
    }
    else{
      this.openDialog('Error','Please select at least one (or more) options from a list');
    }
  }

  openDialog(title: string, message: string){
    this.dialog.open(AlertDialogComponent, {
      width: '350px',
      data: {title: title, message: message}
    });
  }
  openCurrentPage(selectedPage: number,objView, objArr,pager){
      this[pager] = this.pagingService.getPager(this[objArr].length,selectedPage,this.viewItemsOnPaging);
      // this[objView] = this[objArr].slice((selectedPage - 1) * this.viewItemsOnPaging , selectedPage * this.viewItemsOnPaging);
      this[objView] = this[objArr].slice(this[pager].startIndex, this[pager].endIndex + 1);
  }
  // paging(selectedPage: number,objArr){
  //   this.pager =  this.pagingService.getPager(this[objArr].length,selectedPage,this.viewItemsOnPaging);
  // }
}
