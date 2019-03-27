import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../../get-data.service';

@Component({
  selector: 'app-dmrlist',
  templateUrl: './dmrlist.component.html',
  styleUrls: ['./dmrlist.component.css']
})
export class DmrlistComponent implements OnInit {

  constructor(private dataService: GetDataService) { }

  dmrList: any;
  ngOnInit() {
    //this.getDmrList();
  }
  getDmrList(){
    // this.dataService.getDmrsList().subscribe(result => {
    //   this.dmrList = result;
    // });
  }
}
