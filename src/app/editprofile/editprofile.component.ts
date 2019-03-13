import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormArray , FormControl} from '@angular/forms';
import { Menu } from '../classes/menu';
import { GetDataService } from '../get-data.service';
import {  Router } from '@angular/router';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { JsonPipe } from '@angular/common';
import { resource } from 'selenium-webdriver/http';
import { Jet } from '../classes/jet';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit, OnDestroy {

  constructor(
              private fb: FormBuilder, 
              private dataService: GetDataService, 
              private route: Router,
              private dialog: MatDialog) {}

  createMenuFrom:Menu[];

  departments = [
    {controlname:'etch',label:'Etch',ischecked: true},
    {controlname:'photo',label:'Photo',ischecked: false},
    {controlname:'diff',label:'Diff',ischecked: false},
    {controlname:'tf',label:'TF',ischecked: false},
    {controlname:'bm',label:'BM',ischecked: false},
    {controlname:'epi',label:'EPI',ischecked: false},
  ];
  jets;
  jetsArr = [];
  showDmrsBy = ['Waiting For','Jet','Department'];

  viewRadioBlock: string = "";
  editForm;
  username: string;

  ngOnInit() {
    this.username = localStorage.getItem('user');
    this.getListOfNestedBlock(this.username);
  }

  createForm(){
    this.dataService.getMenuForSideNav(this.username).subscribe((result: Menu[]) => {
    this.createMenuFrom = result["menu"];
    this.editForm = this.fb.group({
      menu: this.fb.group(this.createGroupCheckbox(result["menu"]).value),
      showDmrBy:[''],
      showSwrBy:[''],
      showEspBy:[''],
      Jet:this.fb.group(this.createGroupCheckbox(this.jets).value),
      Department: this.fb.group(this.createGroupCheckbox(this.departments).value)
    });

    //radio button temporary selected byDefault start
    this.editForm.get('showDmrBy').value = result["showdmrby"];
    this.viewRadioBlock = result["showdmrby"];
    //radio button temporary selected end

     });
  }
  createGroupCheckbox(arr: any){
    const group = this.fb.group({});
    arr.forEach((control,index) => {
      group.addControl(control.controlname, this.fb.control(control.ischecked));
      this[control.controlname] = control.ischecked;
    });
    return group;
  }

  onSubmit() {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let details = this.editForm.value;

    let jetFilter = this.editForm.get('Jet').value;
    let jetFilterObj: Jet[] = [];

    //convert jetFilter to Jet class with parameters that only true
    Object.keys(jetFilter).forEach(function (item) {
      if(jetFilter[item] == true){
        jetFilterObj.push({JET: item, show : jetFilter[item]});
      }
    });

    let dataToDb = {
      username: userDetails['username'],
      dmr: this.editForm.value['menu']['dmr'],
      swr: this.editForm.value['menu']['swr'],
      esp: this.editForm.value['menu']['esp'],
      showdmrby: this.editForm.get('showDmrBy').value,
      departmentfilter: JSON.stringify(this.editForm.get('Department').value),
      jetfilter: JSON.stringify(jetFilterObj)
    }
    this.dataService.saveUserProfileDetails(dataToDb).subscribe(
      result => {
        if(result){
          this.openDialog('Success','Menu was changed');
        }
        else{
          this.openDialog('Error','Sorry, something went wrong. Please try again later.');
        }
      }
    );
  }

  //check box checked
  toggleVisibility(controlName:string, event){
    let showMenu:Menu = new Menu (controlName.toUpperCase(),true,controlName.toLowerCase());
    if(event.checked)
  {
    this.dataService.sideMenu(showMenu);
  }
  else{
    this.dataService.removeFromSideMenu(showMenu);
  }

  //show/hide nested blocks
    this[controlName.toLowerCase()] = event.checked;
  }

  //radio button selected
  radioChange(event){
    this.viewRadioBlock = event.value;
  }

  openDialog(title:string, message:string){
    this.dialog.open(AlertDialogComponent,{
      width:"350px",
      data: {title:title, message:message}
    });
  }
  ngOnDestroy(){
    
  }

  getListOfNestedBlock(username:string){
    this.dataService.listOfNestedBlock(username)
    .then((result: any) => {
      debugger
      let wrapJetsArr = [];
      let innerJetArr = [];
      let temp = 1;
      let countOfCol = 4;
      let jetsArrLength = Math.round(result.jetsList.length / countOfCol);

      result.jetsList.forEach((element,index) => {
        if((index < jetsArrLength * temp + (temp - 1) && index != result.jetsList.length-1) && innerJetArr.length < jetsArrLength){
          innerJetArr.push(element);
        }
        else if(index === result.jetsList.length-1){
          innerJetArr.push(element);
          wrapJetsArr.push(innerJetArr);
        }
        else{
          wrapJetsArr.push(innerJetArr);
          innerJetArr = [];
          innerJetArr.push(element);
          temp++;
        }
      });
      
      this.jets = result.jetsList;
      this.jetsArr = wrapJetsArr;
    })
    .then(()=>{
      this.createForm();
    });
  }
}
