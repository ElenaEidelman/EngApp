import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import { DmrList } from 'src/app/classes/dmrList';
import { GetDataService } from 'src/app/get-data.service';

@Component({
  selector: 'app-dmr-jet',
  templateUrl: './dmr-jet.component.html',
  styleUrls: ['./dmr-jet.component.css']
})
export class DmrJetComponent implements OnInit {

  constructor(private dataService: GetDataService) { }

  selection = new SelectionModel<DmrList>(true, []);
  displayedColumns: string[] = [];
  dataSource;
  noData: boolean = false;
  displayedData = "Jet";
  
  dmrsData;
 

  ngOnInit() {
    this.getJetDmrs();
  }

  getJetDmrs(){
    let userData = localStorage.getItem("user");
    let departments = [];
    let tools = [];

    this.dataService.getJetDataForViewDmr(userData).subscribe(
      result => {
        try{
          let arr = JSON.parse((result.toString().split("][")).toString());
          arr.map(res => {
            if(res["Name"] == null){
              tools.push(res.toolName);
            }
            else{
              departments.push(res.Name);
            }
          });
  
  
          let dataToDb = {
            dataBy: 'Jet',
            departments: departments,
            tools:tools
          }
      
          this.dataService.getDmrsList(JSON.stringify(dataToDb)).subscribe(
            result => {
              if(Object.keys(result).length > 0){
                this.dmrsData = result;
                let obj = Object.create(DmrList);
                obj = result;
                this.dataSource = new MatTableDataSource<DmrList>(obj);
                this.displayedColumns.push('select');
                Object.keys(obj[0]).forEach((item)=>{
                  this.displayedColumns.push(item);
                });
              }
              else{
                this.dataSource = [];
                this.noData = true;
              }
            }
          );
        }
        catch(error){
          this.dataSource = [];
          this.noData = true;
          console.log(error);
        }
      }
    );
  }

}
