import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GetDataService } from '../get-data.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit,OnChanges {

  @Input()page;
  dmrList;
  viewDMRcontent: boolean = false;
  viewSWRcontent: boolean = false;
  viewDmrList: boolean = false;
  constructor(private dataService: GetDataService) { }

  ngOnInit() {
  }

  callFunction(page){
    switch(page){
      case 'Dmr':{
        this.viewDMRcontent = true;
        this.viewSWRcontent = false;
        this.viewDmrList = false;
        //this.getDmrDetails();
        break;
      }
      case 'Swr':{
        this.viewDMRcontent = false;
        this.viewSWRcontent = true;
        this.viewDmrList = false;
        //this.getSwrDetails();
        break;
      }
      case 'DmrList':{
        this.viewDMRcontent = false;
        this.viewSWRcontent = false;
        this.viewDmrList = true;
        alert('DmrList');
      }
    }
  }

  getDmrDetails(){

    this.dataService.getDmrsList().subscribe(
      result => {
        this.dmrList = result;
      }
    );
    console.log('Dmr');
  }
  getSwrDetails(){
      console.log('Swr');
  }

  setPage($event){
    this.callFunction($event);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.callFunction(changes.page.currentValue);
  }
}
