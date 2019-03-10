import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormArray , FormControl} from '@angular/forms';
import { Menu } from '../classes/menu';
import { GetDataService } from '../get-data.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private dataService: GetDataService, private route: Router) {}

  createMenuFrom:Menu[];

  departments = [
    {controlname:'etch',label:'Etch',ischecked: true},
    {controlname:'photo',label:'Photo',ischecked: false},
    {controlname:'diff',label:'Diff',ischecked: false},
    {controlname:'tf',label:'TF',ischecked: false},
    {controlname:'bm',label:'BM',ischecked: false},
    {controlname:'epi',label:'EPI',ischecked: false},
  ];
  showDmrsBy = ['Waiting For','Jet','Department'];

  viewRadioBlock: string = "";
  editForm;
  username: string;

  ngOnInit() {
    this.username = localStorage.getItem('user');
    this.createForm();
  }

  createForm(){
    this.dataService.getMenuForSideNav(this.username).subscribe((result: Menu[]) => {
    this.createMenuFrom = result;
    this.editForm = this.fb.group({
      menu: this.fb.group(this.createGroupCheckbox(result).value),
      showDmrBy:[''],
      jet:[''],
      DepartmentFilter: this.fb.group(this.createGroupCheckbox(this.departments).value)
    });

    //radio button temporary selected byDefault start
    this.editForm.get('showDmrBy').value = "Jet";
    this.viewRadioBlock = "Jet";
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
    let dataToDb = {
      username: userDetails['username'],
      showDmr: this.editForm.value['menu']['dmr'],
      showSwr: this.editForm.value['menu']['dmr'],
      showEsp: this.editForm.value['menu']['esp']
    }
    this.dataService.saveUserProfileDetails(dataToDb).subscribe(
      result => {
        alert(result);
      }
    );
    console.warn(this.editForm.value);
  }

  //check box checked
  toggleVisibility(controlName:string, event){
    //debugger
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

  ngOnDestroy(){
    
  }
}
