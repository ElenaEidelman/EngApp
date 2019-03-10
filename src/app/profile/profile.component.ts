import { Component, OnInit, Input,OnChanges, SimpleChanges } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import {TooltipPosition} from '@angular/material';
import {FormControl} from '@angular/forms';
import { Menu } from '../classes/menu';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
              private dataService: GetDataService,
              private route: ActivatedRoute,
              private routing: Router) { }

  username: string;
  userDetails = {};

  ngOnInit() {
    this.username = this.getUserName();
    this.getUserDetails(this.username);
  }

  getUserName(){
    return this.route.snapshot.paramMap.get('username');
  }
  getUserDetails(username){
    this.dataService.getUserDetails(username).subscribe(result => {
      //debugger
      let userDetails = {
        username:username,
        name: result[0],
        email: result[3],
        jobTitle:result[4],
        mobile: result[5],
        badge:result[9],
        department:result[10]
      }
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      this.userDetails = result;
    });
  }
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);
  logout(){
    localStorage.removeItem("userExist");
    localStorage.removeItem("user");
    this.routing.navigate(['/logIn']);
  }
}
