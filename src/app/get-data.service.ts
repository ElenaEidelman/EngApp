import { Injectable,EventEmitter } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
//import 'rxjs/Rx';
import { Observable, from, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './classes/users';
import { Menu } from './classes/menu';
import { OnInit,AfterViewInit } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class GetDataService implements OnInit {

  constructor(private http: HttpClient) { 

  }
  baseUrl = 'http://localhost:63778/api';
  menuData = new EventEmitter<Menu[]>();
  menu:Menu[] = [];

 ngOnInit(){

 }
  sideMenu(menu:Menu){
    let index = this.menu.findIndex(element => element['label'] == menu['label']);
    if(index > -1 && this.menu[index]['ischecked'] == false){
      this.menu.splice(index,1);
    }
    this.menu.push(menu);
    this.menuData.emit(this.menu);
  }

  removeFromSideMenu(menu:Menu){
    let index = this.menu.findIndex(element => element['label'] == menu['label']);
    this.menu.splice(index,1);
    this.menuData.emit(this.menu);
  }

  checkUser(userName: string, password: string){
    //debugger
    return this.http.post(`${this.baseUrl}/users/IsValid`,{username: userName, password: password}).pipe(
      map(result => {
        //debugger
        return result;
      })
    );
  }

  userAuthorization(username: string){
    try {
        return this.http.post(`${this.baseUrl}/users/ValidUserDepartment`,new String(username)).toPromise();
    } catch (err) {
        console.log( err);
    } finally {
       // loading.dismiss();
    }
  }

  getUserDetails(username:string){
    return this.http.post(`${this.baseUrl}/users/UserDetails`, new String(username)).pipe(
      map(result => {
        //debugger
        return result;
      })
    );
  }
  
  getMenuForSideNav(username: string):Observable<any>{
    return this.http.post(`${this.baseUrl}/users/ValidMenuForUser`,new String(username)).pipe(
      map(result => {
        this.menu = Object.create(result["menu"]);
        return result;
      })
    );
  }


  getDmrsList(){
    return this.http.get(`${this.baseUrl}/dmrs/getDmrs`).pipe(result => {
      return result;
    });
  }

  saveUserProfileDetails(details: any){
    return this.http.post(`${this.baseUrl}/users/SaveProfileDetails`,details).pipe(
      map(result => {
        return result;
      })
    );
  }
  listOfNestedBlock(username){
    try{
      return this.http.post(`${this.baseUrl}/users/NestedBlocksList`,new String(username)).toPromise();
    }
    catch(err)
    {
      console.log(err);
    }
  }
}
