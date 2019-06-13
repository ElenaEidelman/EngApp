import { Injectable,EventEmitter } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, from, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './classes/users';
import { Menu } from './classes/menu';
import { OnInit} from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class GetDataService implements OnInit {

  constructor(private http: HttpClient) { 

  }
  //ng build --base-href "/LotsInfoMng/" --prod --aot=true
  //baseUrl = 'http://localhost:63778/api';
  baseUrl = 'http://mhvmwebprod3/lotsinfomanagement/api';
  menuData = new EventEmitter<Menu[]>();
  lotInfoData = new EventEmitter();
  userDoEdit = new EventEmitter<string>();
  menu:Menu[] = [];
  lotInfo;

 ngOnInit(){
  this.userDoEdit.emit('');
 }
 editUserDoEdit(msg: string){
   this.userDoEdit.emit(msg);
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
      this.menu[index] = changePathOf;
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
    //let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.baseUrl}/users/IsValid`,{username: userName, password: password}).pipe(
      map(result => {
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
        return result;
      })
    );
  }
  
  getMenuForSideNav(username: string):Observable<any>{
    return this.http.post(`${this.baseUrl}/users/ValidMenuForUser`,new String(username)).pipe(
      map(result => {
        let menu: Menu[] = [];
        result["menu"].forEach(element => {
          let childOfPathM = '';
          switch (element["label"]){
            case "DMR" : switch (result["showdmrby"]){
              case "Jet": 
                childOfPathM = 'dmrByJet';
                break;
              case "Department": 
                childOfPathM = 'dmrByDepartment';
                break;
              }
              break;
            case "SWR": childOfPathM = '';
                break;
            case "ESP": childOfPathM = '';
                break;
            case "LOTINFO": childOfPathM = '';
                break;
          }
  
          menu.push(new Menu (element.label,element.ischecked,element.controlname,childOfPathM));
        });


        this.menu = Object.create(menu);
        return result;
      })
    );
  }


  getDmrsList(data:any){
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
  getDataForGlobalSearch(){
    return this.http.get(`${this.baseUrl}/users/dataForGlobalSearch`).pipe(
      map(result => {
        return result;
      })
    );
  }
  encryptUserData(username,password){
    //var enc = "credentials=" + btoa(JSON.stringify("username:" + userNPass.username + ",pass:" + userNPass.password));
    var enc = 'credentials=username:' + username + ',pass:' + password;
    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.baseUrl}/crypt/encrypt`,enc, {headers: headers}).pipe(
      map(result => {
        return result;
      })
    );
  }

  getDataLotInfo(lotNumber: string){
    //return this.http.post(`${this.baseUrl}/lotInfo/LotInfoData`,new String(lotNumber)).toPromise();
    this.lotInfoData.emit({});
    return this.http.post(`${this.baseUrl}/lotInfo/LotInfoData`,new String(lotNumber)).pipe(
      map(result => {
        this.lotInfoData.emit({lotNumber: lotNumber.split('-')[0], lotData: result});
        this.lotInfo = {lotNumber: lotNumber.split('-')[0], lotData: result};
        return result;
      })
    );
  }
  getBigDataLotInfo(lotNumber: string){
    return this.http.post(`${this.baseUrl}/lotInfo/LotInfoData`,new String(lotNumber)).pipe(
      map(result => {
        return result;
      })
    );
  }
  emptyLotInfo(){
    this.lotInfoData.emit({});
    this.lotInfo = [];
  }

  addToLotInfo(lotNumber: string, obj: any){
    this.lotInfoData.emit({lotNumber: lotNumber, lotData: obj});
    this.lotInfo = {lotNumber: lotNumber, lotData: obj};
  }

}
