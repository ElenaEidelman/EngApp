import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileGuardService } from './profile-guard.service';
import { DmrComponent } from './dmrWindow/dmr/dmr.component';
import { DmrlistComponent } from './dmrWindow/dmrlist/dmrlist.component';
import { NewdmrComponent } from './dmrWindow/newdmr/newdmr.component';
import { DmrsearchComponent } from './dmrWindow/dmrsearch/dmrsearch.component';
import { SwrComponent } from './windowSwr/swr/swr.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { RecordComponent } from './dmrWindow/record/record.component';
import { DmrDepartmentComponent } from './dmrWindow/dmr-department/dmr-department.component';
import { DmrJetComponent } from './dmrWindow/dmr-jet/dmr-jet.component';
import { DmrWaitingforComponent } from './dmrWindow/dmr-waitingfor/dmr-waitingfor.component';
import { ArchionComponent } from './dmrWindow/archion/archion.component';
import { WindowEspComponent } from './window-esp/window-esp.component';
import { WindowLotInfoComponent } from './window-lot-info/info/window-lot-info.component';



const routes: Routes = [
  {path:'', redirectTo: 'logIn', pathMatch: 'full'},
  {path:'logIn', component: LogInComponent},
  {path:'profile/:username', component: ProfileComponent, canActivate: [ProfileGuardService],
    children: [
      { path: 'dmr', component: DmrComponent,
          children:[
            {path:'dmrlist',component:DmrlistComponent, 
              children:[
                {path:'dmrByDepartment', component: DmrDepartmentComponent},
                {path:'dmrByJet', component: DmrJetComponent},
                {path:'dmrByWaitingFor', component: DmrWaitingforComponent},
              ]
            },
            {path:'newdmr',component:NewdmrComponent},
            {path:'dmrsearch',component:DmrsearchComponent},
            {path: 'byMonth', component:RecordComponent},
            {path: 'archion', component:ArchionComponent}

                ]
      },
      {path: 'swr', component: SwrComponent},
      {path: 'lotinfo', component: WindowLotInfoComponent,
        children: []},
      {path:'esp', component: WindowEspComponent},
      {path: 'editprofile',component: EditprofileComponent}
    ]
  },
   {path:'**',redirectTo:'logIn'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[ProfileGuardService]
})
export class AppRoutingModule { }
