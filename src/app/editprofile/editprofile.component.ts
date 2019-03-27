import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormArray , FormControl, FormGroup} from '@angular/forms';
import { Menu } from '../classes/menu';
import { GetDataService } from '../get-data.service';
import {  Router } from '@angular/router';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { JsonPipe } from '@angular/common';
import { resource } from 'selenium-webdriver/http';
import { Jet } from '../classes/jet';
import { Department } from '../classes/department';

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



  // jets = [
  //   {controlname:"all",label:"All",ischecked:false, child:[]},
  //   {controlname:"etch1",label:"Etch1",ischecked:false,child:[
  //     {controlname:"sorters",label:"SORTERS",ischecked:false,child:[
  //       {controlname:"toolsorters1",label:"TOOLSORTERS1",ischecked:true,child:[]},
  //       {controlname:"toolsorters2",label:"TOOLSORTERS2",ischecked:true,child:[]},
  //       {controlname:"toolsorters3",label:"TOOLSORTERS3",ischecked:true,child:[]},
  //       {controlname:"toolsorters4",label:"TOOLSORTERS4",ischecked:true,child:[]}
  //     ]},
  //     {controlname:"dsi-etch",label:"DSI-Etch",ischecked:false,child:[
  //       {controlname:"tooldsietch1",label:"TOOLDSIETCH1",ischecked:true,child:[]},
  //       {controlname:"tooldsietch2",label:"OOLDSIETCH2",ischecked:true,child:[]},
  //       {controlname:"tooldsietch3",label:"OOLDSIETCH3",ischecked:true,child:[]},
  //       {controlname:"tooldsietch4",label:"TOOLDSIETCH4",ischecked:true,child:[]}
  //     ]},
  //     {controlname:"ox-etch",label:"Ox-Etch",ischecked:false,child:[
  //       {controlname:"tooloxetchetch1",label:"TOOLOXETCHETCH1",ischecked:true,child:[]},
  //       {controlname:"tooloxetchetch2",label:"TOOLOXETCHETCH2",ischecked:true,child:[]},
  //       {controlname:"tooloxetchetch3",label:"TOOLOXETCHETCH3",ischecked:true,child:[]},
  //       {controlname:"tooloxetchetch4",label:"TOOLOXETCHETCH4",ischecked:true,child:[]}
  //     ]}
  //   ]},
  //   {controlname:"photo1",label:"PHOTO1",ischecked:false,child:[
  //     {controlname:"sorters",label:"SORTERS",ischecked:false,child:[
  //       {controlname:"toolsortersphoto1",label:"TOOLSORTERSPHOTO1",ischecked:true,child:[]},
  //       {controlname:"toolsortersphoto2",label:"TOOLSORTERSPHOTO2",ischecked:true,child:[]},
  //       {controlname:"toolsortersphoto3",label:"TOOLSORTERSPHOTO3",ischecked:true,child:[]},
  //       {controlname:"toolsortersphoto4",label:"TOOLSORTERSPHOTO4",ischecked:true,child:[]}
  //     ]},
  //     {controlname:"quench",label:"Quench",ischecked:false,child:[
  //       {controlname:"toolquencphoto1",label:"TOOLQUENCHPHOTO1",ischecked:true,child:[]},
  //       {controlname:"toolquencphoto2",label:"TOOLQUENCHPHOTO2",ischecked:true,child:[]},
  //       {controlname:"toolquencphoto3",label:"TOOLQUENCHPHOTO3",ischecked:true,child:[]},
  //       {controlname:"toolquencphoto4",label:"TOOLQUENCHPHOTO4",ischecked:true,child:[]}
  //     ]}
  //   ]},
  // ];
  jets;
  departments;
  //jetsArr = [];
  showDmrsBy = ['Jet','Department'];

  viewRadioBlock: string = "";
  viewJetBlock: string = "";
  //viewToolBlock: string = "";
  viewToolBlock:string[] = [];
  editForm;
  jetForm;
  username: string;
  tools;
  rows:any[] = [];


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
      Jet: this.fb.group(this.createGroupCheckbox(this.jets).value),
      Department: this.fb.group(this.createGroupCheckbox(this.departments).value), 
    });

    //radio button temporary selected byDefault start
    this.editForm.get('showDmrBy').value = result["showdmrby"];
    this.viewRadioBlock = result["showdmrby"];
    //radio button temporary selected end


    //create dynamically jet form
    let formJetControls = {};
    for(let department of this.jets)
    {
      //debugger
      const jetGroup = this.fb.group({});
        department.child.forEach(jet => {
          //debugger
          let toolChecked = [];
          jet.child.forEach(tool => {
            if(tool.ischecked){
              toolChecked.push(tool.controlname);
            }
          });
           if(jet.ischecked){
             if(!this.viewToolBlock.includes(department.controlname + jet.controlname)){
              this.viewToolBlock.push(department.controlname + jet.controlname);
             }
             if(!this.viewJetBlock.includes(department.controlname)){
              this.viewJetBlock += department.controlname + ',';
             }
           }
           jetGroup.addControl(jet.controlname, this.fb.control(jet.ischecked));
           jetGroup.addControl(jet.controlname + 't', this.fb.control(toolChecked));
      });
      formJetControls[department.controlname] = jetGroup;
    }
    this.jetForm = this.fb.group(formJetControls);
    //debugger
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
    // let details = this.editForm.value;
    let depChecked = this.viewJetBlock;
    let jet = this.viewToolBlock;

    // let jetFilter = this.editForm.get('Jet').value;
    let departmentFilter = this.editForm.get("Department").value;
    let departmentFilterObj:Department[] = [];
    //let jetFilterObj: Jet[] = [];
    let jetFilterObj = [];
    let jetFormData = this.jetForm.value;

    //getSelected tools
    Object.keys(jetFormData).forEach((dep) => {
      let jetData = [];
      Object.keys(jetFormData[dep]).forEach((jet) => {
        if(jetFormData[dep][jet] == true && depChecked.includes(dep)){
          let toolsData = jetFormData[dep][jet +'t'];
          let tools = [];
          // if(toolsData.length > 0){
            for(let tool of toolsData){
              tools.push({toolName:tool});
            }
            jetData.push({jetName:jet, toolsArr:tools});
          }
        // }
      });
      if(jetData.length > 0){
        jetFilterObj.push({department: dep, jets: jetData});
      }
    });

     //convert departmentFilter to Department class with parameters that only true
    Object.keys(departmentFilter).forEach((item,index) => {
      if(departmentFilter[item] == true){
        departmentFilterObj.push({name: item, ischecked: true});
      }
    });

    let dataToDb = {
      username: userDetails['username'],
      dmr: this.editForm.value['menu']['dmr'],
      swr: this.editForm.value['menu']['swr'],
      esp: this.editForm.value['menu']['esp'],
      showdmrby: this.editForm.get('showDmrBy').value,
      departmentfilter: JSON.stringify(departmentFilterObj),
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


  openHideJet(controlName:string, event){
    if(event.checked == true){
      this.viewJetBlock += controlName + ',';
    }
    else{
      this.viewJetBlock = this.viewJetBlock.replace(controlName,'');
    }
  }
  openHideTool(controlName:string,parentControlname:string, event){
    if(event.checked == true){
      this.viewToolBlock.push(parentControlname + controlName );
    }
    else{
      var str = (parentControlname + controlName);
      let index = this.viewToolBlock.indexOf(str);
      this.viewToolBlock.splice(index,1);
    }
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
      // jet block start


      // let wrapJetsArr = [];
      // let innerJetArr = [];
      // let temp = 1;
      // let countOfCol = 4;
      // let jetsArrLength = Math.round(result.jetsList.length / countOfCol);

      // //sort jets
      // var sortedArray = result.jetsList.sort(function (a, b) {
      //   if (a.controlname < b.controlname) return -1;
      //   else if (a.controlname > b) return 1;
      //   return 0;
      // });

      // sortedArray.forEach((element,index) => {
      //   if((index < jetsArrLength * temp + (temp - 1) && index != sortedArray.length-1) && innerJetArr.length < jetsArrLength){
      //     innerJetArr.push(element);
      //   }
      //   else if(index === sortedArray.length-1){
      //     innerJetArr.push(element);
      //     wrapJetsArr.push(innerJetArr);
      //   }
      //   else{
      //     wrapJetsArr.push(innerJetArr);
      //     innerJetArr = [];
      //     innerJetArr.push(element);
      //     temp++;
      //   }
      // });
      
      // this.jets = sortedArray;
      // this.jetsArr = wrapJetsArr;


      // jet block end

      this.jets = result.jets;
      this.departments = result.departmentList;
    })
    .then(()=>{
      this.createForm();
    });
  }
}
