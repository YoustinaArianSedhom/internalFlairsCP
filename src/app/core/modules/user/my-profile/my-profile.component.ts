import { Component, OnInit } from '@angular/core';
import { LayoutService } from '@modules/layout/model/layout.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProfileModel } from '../model/user.model';
import { GetMyProfileDetails } from '../state/user.actions';
import { UserState } from '../state/user.state';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styles: [
  ]
})
export class MyProfileComponent implements OnInit {

  constructor(
    private _layoutService: LayoutService,
  ) { }

  @Select(UserState.myProfile) public myProfile$: Observable<ProfileModel>
  @ViewSelectSnapshot(UserState.myProfile) public myProfile: ProfileModel;

  ngOnInit(): void {
    this.fireMyProfileDetails()
    this.myProfile$.subscribe(myProfile=>{
      if(myProfile) {
        this._layoutService.setTitle(myProfile.name)
      }
    }) 

  }
  @Dispatch() public fireMyProfileDetails() {
    return new GetMyProfileDetails()
  }

}
