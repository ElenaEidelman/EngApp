import { Component, OnChanges , OnInit, SimpleChanges} from '@angular/core';
import { GetDataService } from './get-data.service';
import { Menu } from './classes/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnChanges{
  userExist: boolean = localStorage.getItem('userExist') ? true : false;

  constructor(private dataService: GetDataService){}
  ngOnInit(){}



  ngOnChanges(changes: SimpleChanges){

  }

}
