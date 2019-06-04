import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GetDataService } from 'src/app/get-data.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';

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
  linkEncrypt = "";
  color: string = 'rgba(222, 222, 222, 0.5)';

  ngOnInit() {
    this.linkEncrypt = localStorage.getItem('Encrypt');
    this.getViewData();
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

  navigateTo(linkTo: string){
    // window.location.href = linkTo;
    this.route.navigate(['dmrsearch']);
  }
}
