import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { GetDataService } from '../get-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(private dataService: GetDataService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private route: Router) { }

  loginForm = this.fb.group({
    name: ['', Validators.required],
    password: ['', Validators.required]
  });
  spinner = false;
  userExist: boolean = localStorage.getItem('userExist') ? true : false;


  ngOnInit() {
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.spinner = true;
      let userName = this.loginForm.get('name').value;
      let password = this.loginForm.get('password').value;
      this.dataService.checkUser(userName, password).subscribe(result => {
       // debugger
        this.spinner = false;
        if(result){
          //debugger
          localStorage.setItem("userExist","true");
          this.route.navigate(['profile/' + userName]);
        }else{
          this.openDialog('Error','User not exist');
        }
        //this.openDialog('', result.toString());
      });
    }
    else{
      this.openDialog('Error','Please insert all fields');
    }
  }

  openDialog(title: string, message: string){
    this.dialog.open(AlertDialogComponent, {
      width: '350px',
      data: {title: title, message: message}
    });
  }

}
