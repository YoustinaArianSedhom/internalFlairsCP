import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProfileState } from '@modules/profiles/state/profiles.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import * as PROFILE_MODELS from '../../models/profiles.model';

import * as PROFILE_ACTIONS from '../../state/profiles.actions';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {

  @Select(ProfileState.specificProfile)
  public Profile$: Observable<PROFILE_MODELS.ProfilesModel>;

  profileId: string;
  profile: PROFILE_MODELS.ProfilesModel;

  constructor(private route: ActivatedRoute) {}

  @Dispatch() public getProfile(id: string) {
    return new PROFILE_ACTIONS.getProfileById(id);
  }

  @Dispatch() public setSpecificProfileDetailsValueToNull() {
    return new PROFILE_ACTIONS.setSpecificProfileDetails();
  }


  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params.profileId;
      this.getProfile(this.profileId);
    });

    this.Profile$.subscribe((data) => {
      if (data) {
        this.profile = data;
      }
    });
  }

  ngOnDestroy() {
    this.setSpecificProfileDetailsValueToNull();
  }


}
