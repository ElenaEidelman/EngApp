import { Component, OnInit, Input,    Output, EventEmitter, OnDestroy } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { Menu } from '../classes/menu';
import { SubPath } from '../classes/subPath';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit,OnDestroy {

  constructor(private dataService: GetDataService) { }
  @Input() userName;
  @Input() profileImg;
  @Input() userFName;
  menuForSideNav: Menu[] = [];
  unsub;
  subMenu = [
    {label: 'DMR', child:'/dmrlist/'},
    {label: 'SWR', child:''},
    {label: 'ESP', child:''},
    {label: 'LOTINFO', child:''}
  ];


  ngOnInit() {
    this.getMenu();//menu from db
    this.getMenuForSideNavByUsername();//menu if was changed
  }

  getMenu(){
    this.dataService.getMenuForSideNav(this.userName).subscribe((result: Menu[]) => {
      //in the future i will get: showdmrby,showswrby,showespby
      let menu: Menu[] = [];

      result["menu"].forEach(element => {
        let pathM = this.subMenu.find(e => e.label == element.label);
        let childOfPathM = '';

        switch (element["label"]){
          case "DMR" : switch (result["showdmrby"]){
            case "Jet": 
              childOfPathM = 'dmrByJet';
              break;
            case "Department": 
              childOfPathM = 'dmrByDepartment';
              break;
            }
            break;
          case "SWR": childOfPathM = '';
              break;
          case "ESP": childOfPathM = '';
              break;
          case "LOTINFO": childOfPathM = '';
              break;
        }

        menu.push(new Menu (element.label,element.ischecked,element.controlname,pathM.child + childOfPathM));
      });
      this.menuForSideNav = menu;
    });
  }
  //if was changed
  getMenuForSideNavByUsername(){
    this.unsub = this.dataService.menuData.subscribe((result: Menu[]) => {
      let menu: Menu[] = [];
      result.forEach((item)=>{
        let pathM = this.subMenu.find(e => e.label == item["label"]);
        let childOfPathM = '';
        switch (item["label"]){
          case "DMR" : 
            switch (item["path"]){
              case "Jet": childOfPathM = 'dmrByJet';
              break;
              case "Department": childOfPathM = 'dmrByDepartment';
                break;
              default: childOfPathM = item["path"] != undefined ? item["path"] : '';

            }
            break;
          case "SWR": childOfPathM = '';
              break;
          case "ESP": childOfPathM = '';
              break;
          case "LOTINFO": childOfPathM = '';
              break;
        }
        menu.push(new Menu(item["label"],item["ischecked"],item["controlname"],pathM.child + "/" + childOfPathM));
      });
      this.menuForSideNav = menu;
    });
  }
  ngOnDestroy(){
    this.unsub.unsubscribe();
  }
}
