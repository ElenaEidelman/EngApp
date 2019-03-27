import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './extraModules/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule }    from '@angular/common/http';

import { GetDataService  } from './get-data.service';
import { LogInComponent } from './log-in/log-in.component';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileGuardService } from './profile-guard.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ContentComponent } from './content/content.component';
import { DmrComponent } from './dmrWindow/dmr/dmr.component';
import { SwrComponent } from './windowSwr/swr/swr.component';
import { DmrlistComponent } from './dmrWindow/dmrlist/dmrlist.component';
import { NewdmrComponent } from './dmrWindow/newdmr/newdmr.component';
import { DmrsearchComponent } from './dmrWindow/dmrsearch/dmrsearch.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { RecordComponent } from './dmrWindow/record/record.component';
import { DmrDepartmentComponent } from './dmrWindow/dmr-department/dmr-department.component';
import { DmrJetComponent } from './dmrWindow/dmr-jet/dmr-jet.component';
import { DmrWaitingforComponent } from './dmrWindow/dmr-waitingfor/dmr-waitingfor.component';
import { SortABCPipe } from './pipes/sort-abc.pipe';
import { ToArrPipe } from './pipes/to-arr.pipe';
import { TableComponent } from './table/table.component';



@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    AlertDialogComponent,
    ProfileComponent,
    SidenavComponent,
    ContentComponent,
    DmrComponent,
    SwrComponent,
    DmrlistComponent,
    NewdmrComponent,
    DmrsearchComponent,
    EditprofileComponent,
    RecordComponent,
    DmrDepartmentComponent,
    DmrJetComponent,
    DmrWaitingforComponent,
    SortABCPipe,
    ToArrPipe,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule ,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule
  ],
  entryComponents:[
    AlertDialogComponent
  ],
  providers: [GetDataService,ProfileGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
