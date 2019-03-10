import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileGuardService } from './profile-guard.service';
import { ContentComponent } from './content/content.component';
import { DmrComponent } from './dmrWindow/dmr/dmr.component';
import { DmrlistComponent } from './dmrWindow/dmrlist/dmrlist.component';
import { NewdmrComponent } from './dmrWindow/newdmr/newdmr.component';
import { DmrsearchComponent } from './dmrWindow/dmrsearch/dmrsearch.component';
import { SwrComponent } from './windowSwr/swr/swr.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { RecordComponent } from './dmrWindow/record/record.component';



const routes: Routes = [
  {path:'', redirectTo: 'logIn', pathMatch: 'full'},
  {path:'logIn', component: LogInComponent},
  {path:'profile/:username', component: ProfileComponent, canActivate: [ProfileGuardService],
  children: [
    { path: 'dmr', component: DmrComponent,
      children:[
        {path:'dmrlist',component:DmrlistComponent},
        {path:'newdmr',component:NewdmrComponent},
        {path:'dmrsearch',component:DmrsearchComponent},
        {path: 'record', component:RecordComponent}

      ] },
    {path: 'swr', component: SwrComponent},
    {path: 'editprofile',component: EditprofileComponent}
  ]},
  //  {path:'content/:page', component: ContentComponent},



  //  {path:'content', component: ContentComponent},
   {path:'**',redirectTo:'logIn'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[ProfileGuardService]
})
export class AppRoutingModule { }
