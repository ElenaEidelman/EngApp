import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { GetDataService } from './get-data.service';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class ProfileGuardService implements CanActivate{
  constructor(private routeTo: Router, private dataService: GetDataService, private dialog: MatDialog) {}
  
  activated:boolean;
  async canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot){
    //this.userAuthorizationByUsername(route.params['username']).subscribe(result => {
    try{
      await this.userAuthorizationByUsername(route.params['username']).then((result: any) => {
        localStorage.setItem("user",route.params['username']);
        this.activated = result;
      });
    }
    catch(error){
      console.log(error.message);
    }
      if(this.activated && localStorage.getItem("userExist")=="true"){
        //crypt code
        this.dataService.encryptUserData().subscribe(result => {
          localStorage.setItem("Encrypt",result['key']);
        });
        return true;
      }
      else{
          this.openDialog('Error','Sorry, you do not have permission to access');
          this.routeTo.navigate(['/logIn']);
          return false;
      }
  }
  userAuthorizationByUsername(username: string){
   return this.dataService.userAuthorization(username);
  }
  openDialog(title: string, message: string){
    this.dialog.open(AlertDialogComponent,{
      width: '350px',
      data: {title: title, message: message}
    });
  }
}
