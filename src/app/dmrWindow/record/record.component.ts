import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {

  constructor() { }
  data: any;
  ngOnInit() {
    this.data = this.getDmrsOfCurrentMonth();
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
}
