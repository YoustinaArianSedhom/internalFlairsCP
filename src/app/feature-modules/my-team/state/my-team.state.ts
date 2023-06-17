import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { tap } from 'rxjs/operators';
import * as MY_TEAM_MODELS from '../models/my-team.models';
import { MyTeamService } from '../models/my-team.service';
import * as MY_TEAM_ACTIONS  from '../state/my-team.action';

export class MyTeamStateModel {
    public myTeam: MY_TEAM_MODELS.MyTeamModel[];
    public teamPagination: PaginationConfigModel;

    public filtration: MY_TEAM_MODELS.MyTeamFiltrationModel;
    public managers: MY_TEAM_MODELS.ManagerModel[];

    constructor() {
        this.myTeam = [];
        this.teamPagination = {
            pageIndex: 0,
            pageSize: 10
        }
        this.filtration = {};
        this.managers = [];
    }
}

@Injectable()
@State<MyTeamStateModel>({
    name: 'MyTeam',
    defaults: new MyTeamStateModel()
})

export class MyTeamState {
    constructor(private _mainService: MyTeamService){ }

    /* __________________________________________SELECTORS___________________________________*/

    @Selector() static myTeam(state: MyTeamStateModel): MY_TEAM_MODELS.MyTeamModel[] { return state.myTeam }
    @Selector() static teamPagination(state: MyTeamStateModel): PaginationConfigModel { return { ...state.teamPagination } }
    @Selector() static filtration(state: MyTeamStateModel): MY_TEAM_MODELS.MyTeamFiltrationModel { return { ...state.filtration } }
    @Selector() static managers(state: MyTeamStateModel): MY_TEAM_MODELS.ManagerModel[] { return state.managers }
    @Selector() static filtrationManagers(state: MyTeamStateModel): number { return state.filtration.managerIds?.length }

    /*_______________________________________REDUCERS____________________________________ */
    @Action(MY_TEAM_ACTIONS.GetMyTeamPage)
    public getMyTeamPage({ getState, patchState }: StateContext<MyTeamStateModel>) {
        const { teamPagination: { pageIndex, pageSize }, filtration } = getState();
        return this._mainService.getMyTeamPage({ pageIndex, pageSize }, filtration).pipe(
            tap(
                ({ records: myTeam,
                    recordsTotalCount,
                    totalPages,
                    pageIndex,
                    pageSize,
                    previousPage }: PaginationModel<MY_TEAM_MODELS.MyTeamModel>) => {
                    patchState({
                        myTeam,
                        teamPagination: {
                            recordsTotalCount,
                            totalPages,
                            pageIndex,
                            pageSize,
                            previousPageIndex: previousPage,
                        }
                    })
                }
            )
        )
    }

    @Action(MY_TEAM_ACTIONS.PaginateMyTeam)
    public paginateMyTeam({ patchState, dispatch }: StateContext<MyTeamStateModel>, { teamPagination }: MY_TEAM_ACTIONS.PaginateMyTeam) {
        patchState({ teamPagination });
        dispatch(new MY_TEAM_ACTIONS.GetMyTeamPage());
    }

    @Action(MY_TEAM_ACTIONS.SetTeamFilters)
    public setTeamFilters({ patchState, getState }: StateContext<MyTeamStateModel>, { payload }: MY_TEAM_ACTIONS.SetTeamFilters) {
        patchState({ filtration: { ...getState().filtration, ...payload }, teamPagination: { ...getState().teamPagination, pageIndex: 0 } });
    }

    @Action(MY_TEAM_ACTIONS.GetManagers)
    public GetManagers({ patchState }: StateContext<MyTeamStateModel>, { query }: MY_TEAM_ACTIONS.GetManagers) {
        return this._mainService.getManager(query).pipe(
            tap((records) => {
                patchState({ managers: records })
            })
        )
    }
}