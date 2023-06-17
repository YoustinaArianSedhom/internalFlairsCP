import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import { tap } from 'rxjs/operators';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as Profile_MODELS from '../models/profiles.model';
import * as Profile_CONFIG from '../models/profiles.config';
import { ProfilesService } from '../models/profiles.service';
import * as PROFILE_ACTIONS from './profiles.actions';

export class MyTeamsStateModel {
  public Profiles: Profile_MODELS.ProfilesModel[];
  public Skills: Profile_MODELS.Skill[];
  public SpecificProfileDetails: Profile_MODELS.ProfilesModel;
  public pagination: PaginationConfigModel;
  public filtration: Profile_MODELS.RequestTeamModel;
  public searchQuery: string;

  constructor() {
    this.Profiles = null;
    this.Skills = null;
    this.SpecificProfileDetails = null;

    this.pagination = {
      pageSize: 10,
    };
    this.filtration = {};
    this.searchQuery = '';
  }
}
/*_______________________________DEFINING STATE__________________________________*/
@Injectable()
@State<MyTeamsStateModel>({
  name: 'Profiles',
  defaults: new MyTeamsStateModel(),
})
export class ProfileState {
  constructor(private _mainService: ProfilesService) {}

  /*__________________________________________SELECTORS___________________________________*/

  @Selector() static profiles(
    state: MyTeamsStateModel
  ): Profile_MODELS.ProfilesModel[] {
    return state.Profiles;
  }

  @Selector() static skills(state: MyTeamsStateModel): Profile_MODELS.Skill[] {
    return state.Skills;
  }

  @Selector() static specificProfile(
    state: MyTeamsStateModel
  ): Profile_MODELS.ProfilesModel {
    return state.SpecificProfileDetails;
  }

  @Selector() static paginationConfig(
    state: MyTeamsStateModel
  ): PaginationConfigModel {
    return { ...state.pagination };
  }

  @Selector() static filtration(
    state: MyTeamsStateModel
  ): Profile_MODELS.MyTeamsFiltrationModel {
    return { ...state.filtration };
  }

  @Selector() static filtrationSkills(
    state: MyTeamsStateModel
  ):number {
    return state.filtration.skillsIds?.length;
  }

  /*_______________________________________REDUCERS____________________________________*/

  /*_____________Retrieve my tasks table data _____________*/

  @Action(PROFILE_ACTIONS.getProfiles)
  public GetProfiles(
    { getState, patchState }: StateContext<MyTeamsStateModel>,
    { payload }: PROFILE_ACTIONS.getProfiles
  ) {
    const {
      pagination: { pageIndex, pageSize },
    } = getState();
    return this._mainService
      .getProfiles({ pageIndex, pageSize }, { ...payload })
      .pipe(
        tap(
          ({
            records,
            recordsTotalCount,
            totalPages,
            pageIndex,
            pageSize,
            previousPage,
          }: PaginationModel<Profile_MODELS.ProfilesModel>) => {
            patchState({
              Profiles: records,
              pagination: {
                recordsTotalCount,
                totalPages,
                pageIndex,
                pageSize,
                previousPageIndex: previousPage,
              },
            });
          }
        )
      );
  }

  // /*__________________Pagination______________________*/

  @Action(PROFILE_ACTIONS.PaginateMyTeams)
  public PaginateMyTeams(
    { dispatch, patchState, getState }: StateContext<MyTeamsStateModel>,
    { pagination }: PROFILE_ACTIONS.PaginateMyTeams
  ) {
    const state = getState();
    if (pagination.pageSize !== state.pagination.pageSize) {
      pagination.pageIndex = 0;
    }
    patchState({ pagination: { ...state.pagination, ...pagination } });
    dispatch(new PROFILE_ACTIONS.getProfiles(state.filtration));
  }

  @Action(PROFILE_ACTIONS.getSkills)
  public getSkills(
    { dispatch, patchState, getState }: StateContext<MyTeamsStateModel>,
    { query }: PROFILE_ACTIONS.getSkills
  ) {
    const state = getState();
    return this._mainService
      .getSkills(query)
      .pipe(tap((data: any) => patchState({ Skills: data })));
  }

  @Action(PROFILE_ACTIONS.setFilters)
  public SetFilters(
    { dispatch, patchState, getState }: StateContext<MyTeamsStateModel>,
    { payload }: PROFILE_ACTIONS.setFilters
  ) {
    const state = getState();
    patchState({ filtration: { ...state.filtration, ...payload } });
  }

  @Action(PROFILE_ACTIONS.resetFilters)
  public resetFilters({
    dispatch,
    patchState,
    getState,
  }: StateContext<MyTeamsStateModel>) {
    const state = getState();
    patchState({ filtration: {} });
  }

  @Action(PROFILE_ACTIONS.resetFiltersAndPagination)
  public resetFiltersAndPagination({
    dispatch,
    patchState,
    getState,
  }: StateContext<MyTeamsStateModel>) {
    const state = getState();
    patchState({ filtration: {}, pagination: { pageSize: 10 } });
  }
  /*_____________________________Filtration_______________________*/

  @Action(PROFILE_ACTIONS.FilterProfiles)
  public FilterProfiles(
    { patchState, dispatch, getState }: StateContext<MyTeamsStateModel> // { filtration }: MY_TASKS_ACTIONS.FilterMyTeams
  ) {
    const state = getState();
    patchState({
      pagination: { ...getState().pagination, pageIndex: 0 }, // Don't ever forget to reset the page number to zero when you filter or search
    });
    dispatch(new PROFILE_ACTIONS.getProfiles(state.filtration));
  }

  @Action(PROFILE_ACTIONS.setSpecificProfileDetails)
  public SetSpecificProfileDetails(
    { patchState, dispatch, getState }: StateContext<MyTeamsStateModel> // { filtration }: MY_TASKS_ACTIONS.FilterMyTeams
  ) {
    const state = getState();
    patchState({
      SpecificProfileDetails: null,
    });
  }

  @Action(PROFILE_ACTIONS.getProfileById)
  public GetProfileById(
    { patchState, dispatch, getState }: StateContext<MyTeamsStateModel>,
    { id }: PROFILE_ACTIONS.getProfileById
  ) {
    const state = getState();
    return this._mainService.getProfileById(id).pipe(
      tap((client: Profile_MODELS.ProfilesModel) => {
        patchState({ SpecificProfileDetails: client });
      })
    );
  }
}
