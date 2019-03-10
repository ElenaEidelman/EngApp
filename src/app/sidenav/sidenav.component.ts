import { Component, OnInit, Input,    Output, EventEmitter, OnDestroy } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { Menu } from '../classes/menu';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit,OnDestroy {

  constructor(private dataService: GetDataService) { }
  @Input() userName;
  menuForSideNav: Menu[] = [];
  unsub;

  ngOnInit() {
    this.getMenu();//menu from db
    this.getMenuForSideNavByUsername();//menu if was changed
  }

  getMenu(){
    this.dataService.getMenuForSideNav(this.userName).subscribe((result: Menu[]) => {
      this.menuForSideNav = result;
      console.log(this.menuForSideNav);
    });
  }
  getMenuForSideNavByUsername(){
    this.unsub = this.dataService.menuData.subscribe((result: Menu[]) => {
      this.menuForSideNav = result;
    });
  }
  ngOnDestroy(){
    this.unsub.unsubscribe();
  }
}
