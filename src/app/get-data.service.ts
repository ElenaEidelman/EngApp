import { Injectable,EventEmitter } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
//import 'rxjs/Rx';
import { Observable, from, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './classes/users';
import { Menu } from './classes/menu';
import { OnInit,AfterViewInit } from '@angular/core';
import { stringify } from '@angular/compiler/src/util';



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

  changeSubPath(showBy: any){
    let index = this.menu.findIndex(element => element['label'] == showBy["menuName"]);
    if(index > -1){
      let changePathOf = this.menu.find(element => element["label"] == showBy["menuName"]);
      changePathOf["path"] = showBy["viewby"];
      this.menu.splice(index,1);
      this.menu.push(changePathOf);
      this.menuData.emit(this.menu);
    }
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


  getDmrsList(data:any){
    //debugger
    return this.http.post(`${this.baseUrl}/dmrs/DmrList`,new String(data)).pipe(
      map(result => {
        return result;
      })
    );
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

  getJetDataForViewDmr(username: string){
    return this.http.post(`${this.baseUrl}/dmrs/ProvideJetDataForViewDmr`,new String(username)).pipe(
      map(result => {
        return result;
      })
    );
  }
  getDepartmentDataForViewDmr(username: string){
    return this.http.post(`${this.baseUrl}/dmrs/DepartmentDataForViewDmr`,new String(username)).pipe(
      map(result => {
        return result;
      })
    );
  }
  saveToArchion(data:any){
    return this.http.post(`${this.baseUrl}/dmrs/SaveToArchion`,new String(data)).pipe(
      map(result => {
        return result;
      })
    );
  }

  getArchionList(data:any){
    return this.http.post(`${this.baseUrl}/dmrs/ArchionList`,new String(JSON.stringify(data))).pipe(
      map(result => {
        return result;
      })
    );
  }
}
