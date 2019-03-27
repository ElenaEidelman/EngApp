import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GetDataService } from 'src/app/get-data.service';

@Component({
  selector: 'app-dmr',
  templateUrl: './dmr.component.html',
  styleUrls: ['./dmr.component.css']
})
export class DmrComponent implements OnInit {
  @Output() openP = new EventEmitter<any>();
  constructor(
    private route: Router,
    private dataService: GetDataService) { }

  dmrBy = '';
  badge;
  userName = localStorage.getItem('user');

  ngOnInit() {
    this.getViewData();
  }
  openPage(page: string) {
    this.openP.emit(page);
  }
  getViewData() {
    let viewDmrBy;
    this.dataService.getMenuForSideNav(this.userName).subscribe(result => {
      viewDmrBy = result['showdmrby'];
      switch (viewDmrBy) {
        case "Jet": this.dmrBy = 'dmrByJet';
          break;
        case "Department": this.dmrBy = 'dmrByDepartment';
          break;
      }

    });


  }
  navigateTo(page: string) {
    this.route.navigate(['dmrlist']);
  }
}
