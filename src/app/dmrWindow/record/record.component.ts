import { Component, OnInit } from '@angular/core';
import { DmrList } from 'src/app/classes/dmrList';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { GetDataService } from 'src/app/get-data.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {

  constructor(
              private dataService: GetDataService
  ) { }
  data: any;

  selection = new SelectionModel<DmrList>(true, []);
  displayedColumns: string[] = [];
  dataSource;
  noData: boolean = false;
  dmrsData;
  displayedData = "Record";
  userDepartment;
  ngOnInit() {
    this.data = this.getDmrsOfCurrentMonth();
    this.getRecordDmrs();
    this.userDepartment = JSON.parse(localStorage.getItem('userDetails'))['departmentForDmr'];
  }

  getDmrsOfCurrentMonth(){
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let str =  `${day}/${month}/${year}  ${userDetails['username']} - ${userDetails['department']}`;
    return str;
  }

  getRecordDmrs(){
    let dataToDb = {
      dataBy: 'Record',
      userDeprtment: this.userDepartment
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
}
