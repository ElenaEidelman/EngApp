import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Menu } from '../classes/menu';
import { GetDataService } from '../get-data.service';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { JsonPipe } from '@angular/common';
import { resource } from 'selenium-webdriver/http';
import { Jet } from '../classes/jet';
import { Department } from '../classes/department';
import { MatOption } from '@angular/material';
import { SubPath } from '../classes/subPath';

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
    private dialog: MatDialog) { }

  createMenuFrom: Menu[];
  jets;
  departments;
  showDmrsBy = ['Jet', 'Department'];

  viewRadioBlock: string = "";
  viewJetBlock: string = "";
  viewToolBlock: string[] = [];
  editForm;
  jetForm;
  username: string;
  tools;
  rows: any[] = [];


  ngOnInit() {
    this.username = localStorage.getItem('user');
    this.getListOfNestedBlock(this.username);
  }

  createForm() {
    this.dataService.getMenuForSideNav(this.username).subscribe((result: Menu[]) => {
      this.createMenuFrom = result["menu"];
      this.editForm = this.fb.group({
        menu: this.fb.group(this.createGroupCheckbox(result["menu"]).value),
        showDmrBy: [''],
        showSwrBy: [''],
        showEspBy: [''],
        lotinfo:[''],
        Jet: this.fb.group(this.createGroupCheckbox(this.jets).value),
        Department: this.fb.group(this.createGroupCheckbox(this.departments).value),
      });

      //radio button temporary selected byDefault start
      this.editForm.get('showDmrBy').value = result["showdmrby"];
      this.viewRadioBlock = result["showdmrby"];
      //radio button temporary selected end


      //create dynamically jet form
      let formJetControls = {};
      for (let department of this.jets) {
        //debugger
        const jetGroup = this.fb.group({});
        department.child.forEach(jet => {
          //debugger
          let toolChecked = [];
          jet.child.forEach(tool => {
            if (tool.ischecked) {
              toolChecked.push(tool.controlname);
            }
          });
          if (jet.ischecked) {
            // if (!this.viewToolBlock.includes(department.controlname + jet.controlname)) {
              if (this.viewToolBlock.indexOf(department.controlname + jet.controlname) == -1) {
              this.viewToolBlock.push(department.controlname + jet.controlname);
            }
            // if (!this.viewJetBlock.includes(department.controlname)) {
              if (this.viewJetBlock.indexOf(department.controlname) == -1) {
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

  createGroupCheckbox(arr: any) {
    const group = this.fb.group({});
    arr.forEach((control, index) => {
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
    let departmentFilterObj: Department[] = [];
    //let jetFilterObj: Jet[] = [];
    let jetFilterObj = [];
    let jetFormData = this.jetForm.value;

    //getSelected tools
    Object.keys(jetFormData).forEach((dep) => {
      let jetData = [];
      Object.keys(jetFormData[dep]).forEach((jet) => {
        // if (jetFormData[dep][jet] == true && depChecked.includes(dep)) {
          if (jetFormData[dep][jet] == true && (depChecked.indexOf(dep) != -1)) {
          let toolsData = jetFormData[dep][jet + 't'];
          let tools = [];
          // if(toolsData.length > 0){
          for (let tool of toolsData) {
            tools.push({ toolName: tool });
          }
          jetData.push({ jetName: jet, toolsArr: tools });
        }
        // }
      });
      if (jetData.length > 0) {
        jetFilterObj.push({ department: dep, jets: jetData });
      }
    });

    //convert departmentFilter to Department class with parameters that only true
    Object.keys(departmentFilter).forEach((item, index) => {
      if (departmentFilter[item] == true) {
        departmentFilterObj.push({ name: item, ischecked: true });
      }
    });
    let dataToDb = {
      username: userDetails['username'],
      badge: userDetails['badge'],
      dmr: this.editForm.value['menu']['dmr'],
      swr: this.editForm.value['menu']['swr'],
      esp: this.editForm.value['menu']['esp'],
      lotinfo: this.editForm.value['menu']['lotinfo'],
      showdmrby: this.editForm.get('showDmrBy').value,
      departmentfilter: JSON.stringify(departmentFilterObj),
      jetfilter: JSON.stringify(jetFilterObj)
    }
    this.dataService.saveUserProfileDetails(dataToDb).subscribe(
      result => {
        debugger
        if (result) {
          this.openDialog('Success', 'Menu was changed');
        }
        else {
          this.openDialog('Error', 'Sorry, something went wrong. Please try again later.');
        }
      }
    );
  }
  //check box checked
  toggleVisibility(controlName: string, event) {
    //select all in check box
    // if (controlName.includes('all')) {
      if (controlName.indexOf('all') > 0) {
      let pref = controlName.substring(0, controlName.indexOf('-'));
      if (pref == 'department') {
        if (event.checked) {
          Object.keys(this.editForm.get('Department').controls).forEach(dep => {
            this.editForm.get('Department').get(dep).setValue(true);
          });
        }
        else {
          Object.keys(this.editForm.get('Department').controls).forEach(dep => {
            this.editForm.get('Department').get(dep).setValue(false);
          });
        }
      }
    }
    //select one check box
    else {
      let path = this.editForm.get('showDmrBy').value;
      let showMenu: Menu = new Menu(controlName.toUpperCase(), true, controlName.toLowerCase(),path);
      if (event.checked) {
        this.dataService.sideMenu(showMenu);
      }
      else {
        this.dataService.removeFromSideMenu(showMenu);
      }

      //show/hide nested blocks
      this[controlName.toLowerCase()] = event.checked;
    }
  }


  openHideJet(controlName: string, event) {
    if (event.checked == true) {
      this.viewJetBlock += controlName + ',';
    }
    else {
      this.viewJetBlock = this.viewJetBlock.replace(controlName, '');
    }
  }
  openHideTool(controlName: string, parentControlname: string, event) {
    if (event.checked == true) {
      this.viewToolBlock.push(parentControlname + controlName);
    }
    else {
      var str = (parentControlname + controlName);
      let index = this.viewToolBlock.indexOf(str);
      this.viewToolBlock.splice(index, 1);
    }
  }

  //radio button selected
  radioChange(event) {
    this.dataService.changeSubPath(new SubPath('DMR',event.value));
    this.viewRadioBlock = event.value;
  }

  openDialog(title: string, message: string) {
    this.dialog.open(AlertDialogComponent, {
      width: "350px",
      data: { title: title, message: message }
    });
  }
  ngOnDestroy() {

  }

  getListOfNestedBlock(username: string) {
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
      .then(() => {
        this.createForm();
      });
  }


  selectAll(department: string, control: string) {
    let toolObj = [];
    this.jets.find(d => d.controlname == department).child.find(j => j.controlname == control).child.forEach(t => {
      toolObj.push(t.controlname)
    });
    this.jetForm.get(department).get(control + 't').patchValue(toolObj);
  }
  deselectAll(department: string, control: string) {
    this.jetForm.get(department).get(control + 't').patchValue([])
  }

  ngAfterViewInit() {
  }
  include(str: string, subStr){
    return this[str].indexOf(subStr) > -1;
  }
}
