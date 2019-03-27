import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import { DmrList } from 'src/app/classes/dmrList';
import { GetDataService } from 'src/app/get-data.service';

@Component({
  selector: 'app-dmr-department',
  templateUrl: './dmr-department.component.html',
  styleUrls: ['./dmr-department.component.css']
})
export class DmrDepartmentComponent implements OnInit {

  constructor(private dataService: GetDataService) { }

  selection = new SelectionModel<DmrList>(true, []);
  displayedColumns: string[] = [];
  dataSource;
  
  dmrsData;

  ngOnInit() {
    this.getDepartmentDmrs();
  }

  getDepartmentDmrs(){
    let userData = localStorage.getItem("user");
    let departments = [];

    this.dataService.getDepartmentDataForViewDmr(userData).subscribe(
      result => {
        var arr = JSON.parse((result.toString().split("][")).toString());
        arr.map(res => {
            departments.push(res.Name);
        });


        let dataToDb = {
          dataBy: 'Department',
          departments: departments,
        }
        this.dataService.getDmrsList(JSON.stringify(dataToDb)).subscribe(
          result => {
            this.dmrsData = result;
            let obj = Object.create(DmrList);
            obj = result;
            //debugger
            this.dataSource = new MatTableDataSource<DmrList>(obj);
            this.displayedColumns.push('select');
            //debugger
            Object.keys(obj[0]).forEach((item)=>{
              this.displayedColumns.push(item);
            });
          }
        );
      }
    );
  }

}
