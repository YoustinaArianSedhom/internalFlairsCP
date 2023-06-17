import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { OrgEntityModel, OrgModel, OrgSalaryLevelModel } from '../model/organization.model';
import { OrganizationService } from '../model/organization.service';
import { GetMyOrganization, GetOrgEntities, GetOrgSalaryLevels } from './organization.actions';

export class OrganizationStateModel {
  public organization: OrgModel;
  public entities: OrgEntityModel[];
  public salaryLevels: OrgSalaryLevelModel[];
}

@Injectable()
@State<OrganizationStateModel>({
  name: 'organization',
})
export class OrganizationState {


  constructor(
    private _orgService: OrganizationService
  ) { }


  @Selector()
  static org(state: OrganizationStateModel): OrgModel {
    return state.organization;
  }

  @Selector()
  static entities(state: OrganizationStateModel): OrgEntityModel[] {
    return state.entities;
  }

  @Selector()
  static salaryLevels(state: OrganizationStateModel): OrgSalaryLevelModel[] {
    return state.salaryLevels;
  }




  @Action(GetMyOrganization)
  public getMyOrganization({ patchState }: StateContext<OrganizationStateModel>) {
    return this._orgService.getMyOrganization().pipe(
      tap((organization: OrgModel) => patchState({ organization })));
  }


  @Action(GetOrgEntities)
  public getOrgEntities({ patchState }: StateContext<OrganizationStateModel>) {
    return this._orgService.getOrgEntities().pipe(
      tap((entities: OrgEntityModel[]) => patchState({ entities }))
    )
  }

  @Action(GetOrgSalaryLevels)
  public getOrgSalaryLevels({ patchState }: StateContext<OrganizationStateModel>) {
    return this._orgService.getOrgSalaryLevels().pipe(
      tap((salaryLevels: OrgSalaryLevelModel[]) => patchState({ salaryLevels }))
    )
  }
}
