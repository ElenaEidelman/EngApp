import { Component, OnChanges , OnInit, SimpleChanges, HostListener, ViewChild} from '@angular/core';
import { GetDataService } from './get-data.service';
import { Menu } from './classes/menu';
import { Subject } from 'rxjs';
import { ProfileComponent } from './profile/profile.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnChanges{
  userExist: boolean = localStorage.getItem('userExist') ? true : false;


  userActivity;
  userInactive: Subject<any> = new Subject();

  constructor(private dataService: GetDataService, private routing: Router){
    this.setTimeout();
    this.userInactive.subscribe(() => {
      localStorage.removeItem("userExist");
      localStorage.removeItem("user");
      localStorage.removeItem("Encrypt");
      localStorage.removeItem("viewDataBy");
      localStorage.removeItem("userDetails");
      localStorage.removeItem("userPass");
      this.dataService.emptyLotInfo();
      this.routing.navigate(['/logIn']);
    });
  }
  ngOnInit(){}

  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 1000 * 60 * 10 );
  }

  //if user have activity
  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }


  ngOnChanges(changes: SimpleChanges){

  }

}
