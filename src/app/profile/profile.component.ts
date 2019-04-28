import { Component, OnInit, Input,OnChanges, SimpleChanges } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import {TooltipPosition} from '@angular/material';
import {FormControl} from '@angular/forms';
import { Menu } from '../classes/menu';
import { DomSanitizer } from '@angular/platform-browser';
import { LOCALE_DATA } from '@angular/common/src/i18n/locale_data';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
              private _sanitizer: DomSanitizer,
              private dataService: GetDataService,
              private route: ActivatedRoute,
              private routing: Router) { }

  username: string;
  userDetails = {};
  imgSrc;

  ngOnInit() {
    this.username = this.getUserName();
    this.getUserDetails(this.username);

  }

  getUserName(){
    return this.route.snapshot.paramMap.get('username');
  }
  getUserDetails(username){
    this.dataService.getUserDetails(username).subscribe(result => {
      let userDetails = {
        username:username,
        name: result[0],
        email: result[3],
        jobTitle:result[4],
        mobile: result[5],
        badge:result[9],
        department:result[10],
        departmentForDmr: result[12]
      }
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      this.userDetails = result;
      this.imgSrc = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg' + ';base64,' + result[11]);
      
    });
  }
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);
  logout(){
    localStorage.removeItem("userExist");
    localStorage.removeItem("user");
    localStorage.removeItem("Encrypt");
    localStorage.removeItem("viewDataBy");
    localStorage.removeItem("userDetails");
    this.routing.navigate(['/logIn']);
  }
}
