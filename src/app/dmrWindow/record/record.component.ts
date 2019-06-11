import { Component, OnInit } from '@angular/core';
import { DmrList } from 'src/app/classes/dmrList';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { GetDataService } from 'src/app/get-data.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {

  constructor(
    private dataService: GetDataService,
    private fb: FormBuilder
  ) { }
  data: any;

  selection = new SelectionModel<DmrList>(true, []);
  displayedColumns: string[] = [];
  dataSource;
  noData: boolean = false;
  dmrsData;
  displayedData = "ByMonth";
  userDepartment;
  spinner: boolean = false;

  dateForm = this.fb.group({
    DateFrom: [''],
    DateTo: ['']
  });
  ngOnInit() {
    // this.data = this.getDmrsOfCurrentMonth();
    this.userDepartment = JSON.parse(localStorage.getItem('userDetails'))['departmentForDmr'];
    this.dateForm.get('DateFrom').setValue(new Date(this.getDateFrom()));
    this.getDmrs();

  }

  getDateFrom() {
    let DateFrom;
    let date = new Date();
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    let year = date.getFullYear();


    //if first day num 1 of month
    if (day == '01') {
      let changedToDate = new Date(month + "/01/" + year);
      let newD = new Date(changedToDate.setDate(changedToDate.getDate() - 1));
      let newday = newD.getDate() < 10 ? "0" + newD.getDate() : newD.getDate();
      let newmonth = (newD.getMonth() + 1) < 10 ? "0" + (newD.getMonth() + 1) : (newD.getMonth() + 1);
      let newyear = newD.getFullYear();


      this.dateForm.get('DateTo').setValue(new Date(newmonth + "/" + newday + "/" + newyear + " 15:03:03"));
      month = +month - 1;
      DateFrom = month + "/" + "01" + "/" + year + " 15:03:03";

    }
    else {
      this.dateForm.get('DateTo').setValue(new Date());
      DateFrom = month + "/" + "01" + "/" + year;
    }



    return DateFrom;
  }

  getDmrs() {
    this.spinner = true;
    let tempDateFrom = this.dateForm.get('DateFrom').value;
    let tempDateTo = this.dateForm.get('DateTo').value;

    let dayFrom = tempDateFrom.getDate() < 10 ? "0" + tempDateFrom.getDate() : tempDateFrom.getDate();
    let monthFrom = (tempDateFrom.getMonth() + 1) < 10 ? "0" + (tempDateFrom.getMonth() + 1) : (tempDateFrom.getMonth() + 1);
    let yearFrom = tempDateFrom.getFullYear();

    let dayTo = tempDateTo.getDate() < 10 ? "0" + tempDateTo.getDate() : tempDateTo.getDate();
    let monthTo = (tempDateTo.getMonth() + 1) < 10 ? "0" + (tempDateTo.getMonth() + 1) : (tempDateTo.getMonth() + 1);
    let yearTo = tempDateTo.getFullYear();

    let dataToDb = {
      dataBy: 'ByMonth',
      userDeprtment: this.userDepartment,
      dateFrom: new Date(monthFrom + "/" + dayFrom + "/" + yearFrom + " 15:03:03"),
      dateTo: new Date(monthTo + "/" + dayTo + "/" + yearTo + " " + " 15:03:03")
    }
    this.dataService.getDmrsList(JSON.stringify(dataToDb)).subscribe(
      result => {
        this.spinner = false;
        if (Object.keys(result).length > 0) {
          this.noData = false;
          this.dmrsData = result;
          let obj = Object.create(DmrList);
          obj = result;
          this.dataSource = new MatTableDataSource<DmrList>(obj);
          // to prevent duplicat columns
          if (this.displayedColumns.indexOf('select') == -1) {
            this.displayedColumns.push('select');
            Object.keys(obj[0]).forEach((item) => {
              this.displayedColumns.push(item);
            });
          }

          // this.displayedColumns.push('select');
          // Object.keys(obj[0]).forEach((item) => {
          //   this.displayedColumns.push(item);
          // });
        }
        else {
          this.dataSource = [];
          this.displayedColumns = [];
          this.noData = true;
        }
      }
    );

  }
}
