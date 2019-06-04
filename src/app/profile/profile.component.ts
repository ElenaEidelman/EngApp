import { Component, OnInit, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipPosition } from '@angular/material';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';





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

  showScrollHeight = 300;
  hideScrollHeight = 10;
  buttonToUp: boolean = false;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);

  @HostListener('scroll', [])
  onWindowScroll(event) {
    var el = document.querySelector('.content');
    var destinationFromTop = el.scrollTop;
    if (destinationFromTop > this.showScrollHeight) {
      this.buttonToUp = true;
    }
    else if (this.buttonToUp && (destinationFromTop < this.hideScrollHeight)) {
      this.buttonToUp = false;
    }
  }

  ngOnInit() {
    this.username = this.getUserName();
    this.getUserDetails(this.username);

  }

  getUserName() {
    return this.route.snapshot.paramMap.get('username');
  }
  getUserDetails(username) {
    this.dataService.getUserDetails(username).subscribe(result => {
      let userDetails = {
        username: username,
        password: result[13],
        name: result[0],
        email: result[3],
        jobTitle: result[4],
        mobile: result[5],
        badge: result[9],
        department: result[10],
        departmentForDmr: result[12]
      }
      //crypt code
      this.dataService.encryptUserData(userDetails.username, userDetails.password).subscribe(result => {
        localStorage.setItem("Encrypt", result['key']);
      });
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      this.userDetails = result;
      this.imgSrc = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg' + ';base64,' + result[11]);

    });
  }

  logout() {
    localStorage.removeItem("userExist");
    localStorage.removeItem("user");
    localStorage.removeItem("Encrypt");
    localStorage.removeItem("viewDataBy");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("userPass");
    this.dataService.emptyLotInfo();
    this.routing.navigate(['/logIn']);
  }



  scrollToTop() {
    let browser = navigator.userAgent;
    (function smoothscroll() {
      var el = document.querySelector('.content');
      var currentScroll = el.scrollTop;
      if (currentScroll > 0) {
        // Internet Explorer browser
        if((browser.indexOf("MSIE ") > -1 || browser.indexOf("Trident/") > -1)){
          // el.scrollTop = (currentScroll - (currentScroll / 5));
          el.scrollTop = 0;
        }
        else{
          el.scrollTo(0, 0);
        }
        // window.requestAnimationFrame(smoothscroll);
      }
    })();
  }
}
