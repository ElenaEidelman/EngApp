import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { DmrList } from 'src/app/classes/dmrList';
import { FormBuilder, FormArray } from '@angular/forms';
import { GetDataService } from 'src/app/get-data.service';
import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material';


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
  ) { }

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
  displayedColumns: string[];
  dataSource;
  noData: boolean = true;
  dmrsData;
  displayedData = "";
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
      this.waitingForArr = data['users'].sort((a, b) => a > b ? 1 : -1);
      this.waitingForArr.unshift('ALL');

      this.categoryArr = data['category'].sort((a, b) => a > b ? 1 : -1);
      this.categoryArr.unshift('ALL');

      this.defectGroup1Arr = data['defG1'].sort((a, b) => a > b ? 1 : -1);
      this.defectGroup1Arr.unshift('ALL');

      this.defectGroup2Arr = data['defG2'].sort((a, b) => a > b ? 1 : -1);
      this.defectGroup2Arr.unshift('ALL');

      this.equipmentArr = data['equipment'].sort((a, b) => a > b ? 1 : -1);
      this.equipmentArr.unshift('ALL');
      this.selectedEquipments = this.equipmentArr;
      this.selectedDefectGroup1 = this.defectGroup1Arr;
      this.selectedDefectGroup2 = this.defectGroup2Arr;
      this.selectedWaitingFor = this.waitingForArr;
      this.selectedTitels = this.titlesArr;
      this.selectedLocations = this.locationArr;
    });
  }

  applyFilter(selected,dataArr,filterValue: string){

    let result = this.select(dataArr,filterValue);
    this[selected] = result;
  }

  select(control: string, query: string):string[]{
    let result: string[] = [];

    for(let a of this[control]){
      if(a.toLowerCase().indexOf(query) > -1){
        result.push(a)
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
      let dataToDb = {
        dataBy: 'Global',
        globalSearch: this.dmrSearchForm.value
      }
      this.dataService.getDmrsList(JSON.stringify(dataToDb)).subscribe(result => {
        debugger
      });
      console.log(this.dmrSearchForm.value);
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
}
