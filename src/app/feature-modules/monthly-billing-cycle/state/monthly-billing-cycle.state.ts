import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import * as MONTHLY_BILLING_CYCLES from '../models/monthly-billing-cycle.models';
import * as MONTHLY_BILLING_ACTIONS from './monthly-billing-cycle.actions';
import { MonthlyBillingCycleService } from "../models/monthly-billing-cycle.service";
import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { PaginationModel } from '@core/http/apis.model';
import { tap } from "rxjs/operators";
import { downloadFile } from "@shared/helpers/download-file.helper";
import * as MONTHLY_BILLING_CYCLES_MODELS from '@modules/monthly-billing-cycle/models/monthly-billing-cycle.models';


export class MonthlyBillingStateModel {
    /* Monthly Billing Cycles Store Properties  */
    public monthlyBillingCycles: MONTHLY_BILLING_CYCLES.MonthlyBillingCycleModel[];
    public monthlyBillingPagination: PaginationConfigModel;

    /* Monthly Billing Cycles Details Store Properties  */

    public monthlyBillingCyclesDetails: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel[];
    public monthlyBillingCyclesDetailsPagination: PaginationConfigModel;

    public monthlyBillingCyclesDetailsFiltration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel;

    /* Unassociated Subordinates Store Properties */

    public unassociatedSubsCount: number;
    public unassociatedSubs: MONTHLY_BILLING_CYCLES_MODELS.UnassociatedSubsModel[];
    public unassociatedSubsPagination: PaginationConfigModel;
    public unassociatedSubsFiltration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel;
    public showBillingRateAndAmount: boolean



    constructor() {
        this.monthlyBillingCycles = [];
        this.monthlyBillingPagination = {
            pageIndex: 0,
            pageSize: 10
        };

        this.monthlyBillingCyclesDetails = [];
        this.monthlyBillingCyclesDetailsPagination = {
            pageIndex: 0,
            pageSize: 10
        };
        this.monthlyBillingCyclesDetailsFiltration = {
            searchQuery: ''
        }

        this.unassociatedSubs = [];
        this.unassociatedSubsPagination = {
            pageIndex: 0,
            pageSize: 10
        };
        this.unassociatedSubsFiltration = {
            searchQuery: '',
            directOnly: false
        }
        this.unassociatedSubsCount = 0;
        this.showBillingRateAndAmount = false;
    }
}

@Injectable()
@State<MonthlyBillingStateModel>({
    name: 'MonthlyBillingCycles',
    defaults: new MonthlyBillingStateModel()
})
export class MonthlyBillingCyclesState {
    constructor(private _mainService: MonthlyBillingCycleService) { }

    /*__________________________________________  Monthly Billing Cycles SELECTORS___________________________________ */

    @Selector() static monthlyBillingCycles(state: MonthlyBillingStateModel): MONTHLY_BILLING_CYCLES.MonthlyBillingCycleModel[] { return state.monthlyBillingCycles };
    @Selector() static monthlyBillingPagination(state: MonthlyBillingStateModel): PaginationConfigModel { return { ...state.monthlyBillingPagination } };

    /*__________________________________________  Monthly Billing Cycles Details SELECTORS___________________________________ */

    @Selector() static monthlyBillingCyclesDetails(state: MonthlyBillingStateModel): MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel[] { return state.monthlyBillingCyclesDetails };
    @Selector() static monthlyBillingCyclesDetailsPagination(state: MonthlyBillingStateModel): PaginationConfigModel { return { ...state.monthlyBillingCyclesDetailsPagination } };
    @Selector() static monthlyBillingCyclesDetailsFiltration(state: MonthlyBillingStateModel): MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel { return { ...state.monthlyBillingCyclesDetailsFiltration } }
    @Selector() static monthlyBillingCyclesDetailsSearchQuery(state: MonthlyBillingStateModel): string { return state.monthlyBillingCyclesDetailsFiltration.searchQuery }

    /*__________________________________________  Unassociated Subordinates SELECTORS___________________________________ */
    @Selector() static unassociatedSubsCount(state: MonthlyBillingStateModel): number { return state.unassociatedSubsCount }
    @Selector() static unassociatedSubs(state: MonthlyBillingStateModel): MONTHLY_BILLING_CYCLES_MODELS.UnassociatedSubsModel[] { return state.unassociatedSubs };
    @Selector() static unassociatedSubsPagination(state: MonthlyBillingStateModel): PaginationConfigModel { return { ...state.unassociatedSubsPagination } };
    @Selector() static unassociatedSubsFiltration(state: MonthlyBillingStateModel): MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel { return { ...state.unassociatedSubsFiltration } };
    @Selector() static unassociatedSubsSearchQuery(state: MonthlyBillingStateModel): string { return state?.unassociatedSubsFiltration?.searchQuery };
    @Selector() static showBillingRateAndAmount(state: MonthlyBillingStateModel): boolean { return state.showBillingRateAndAmount }


    /*__________________________________________ Monthly Billing Cycles REDUCERS___________________________________*/

    @Action(MONTHLY_BILLING_ACTIONS.GetMonthlyBillingCycles)
    public GetMonthlyBillingCycles({ getState, patchState }: StateContext<MonthlyBillingStateModel>) {
        const { monthlyBillingPagination: { pageIndex, pageSize } } = getState();
        return this._mainService.getMonthlyBillingCycles({ pageIndex, pageSize }).pipe(
            tap(
                ({ records: monthlyBillingCycles, recordsTotalCount,
                    totalPages,
                    pageIndex,
                    pageSize,
                    previousPage }: PaginationModel<MONTHLY_BILLING_CYCLES.MonthlyBillingCycleModel>) => {
                    patchState({
                        monthlyBillingCycles,
                        monthlyBillingPagination: {
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

    @Action(MONTHLY_BILLING_ACTIONS.PaginateMonthlyBillingCycles)
    public PaginateMonthlyBillingCycles({ patchState, dispatch }: StateContext<MonthlyBillingStateModel>, { monthlyBillingPagination }: MONTHLY_BILLING_ACTIONS.PaginateMonthlyBillingCycles) {
        patchState({ monthlyBillingPagination });
        dispatch(new MONTHLY_BILLING_ACTIONS.GetMonthlyBillingCycles());
    }

    @Action(MONTHLY_BILLING_ACTIONS.ExportMonthlyBillingCyclesAsExcel)
    public ExportMonthlyBillingCyclesAsExcel({ }: StateContext<MonthlyBillingStateModel>) {
        return this._mainService.exportMonthlyBillingCyclesAsExcel().pipe(
            tap(res => downloadFile(res.body, `Monthly Billing Cycles.xlsx`))

        )
    }

    /*__________________________________________ Monthly Billing Cycles Details REDUCERS___________________________________*/

    @Action(MONTHLY_BILLING_ACTIONS.GetMonthlyBillingCyclesDetails)
    public GetMonthlyBillingCyclesDetails({ getState, patchState }: StateContext<MonthlyBillingStateModel>) {
        const { monthlyBillingCyclesDetailsPagination: { pageIndex, pageSize } } = getState();
        const filtration = { ...getState().monthlyBillingCyclesDetailsFiltration };
        return this._mainService.getMonthlyBillingCyclesDetails({ pageIndex, pageSize }, filtration).pipe(
            tap(
                ({
                    totalPages,
                    recordsTotalCount,
                    pageIndex,
                    pageSize,
                    previousPage,
                    records: monthlyBillingCyclesDetails
                }: PaginationModel<MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel>) =>
                    patchState({
                        monthlyBillingCyclesDetails,
                        monthlyBillingCyclesDetailsPagination: {
                            recordsTotalCount,
                            totalPages,
                            pageIndex,
                            pageSize,
                            previousPageIndex: previousPage,
                        }
                    }))
        )

    }

    @Action(MONTHLY_BILLING_ACTIONS.PaginateMonthlyBillingCyclesDetails)
    public PaginateMonthlyBillingCyclesDetails({ patchState, dispatch }: StateContext<MonthlyBillingStateModel>, { monthlyBillingCyclesDetailsPagination }: MONTHLY_BILLING_ACTIONS.PaginateMonthlyBillingCyclesDetails) {
        patchState({ monthlyBillingCyclesDetailsPagination });
        dispatch(new MONTHLY_BILLING_ACTIONS.GetMonthlyBillingCyclesDetails());
    }

    @Action(MONTHLY_BILLING_ACTIONS.FilterMonthlyBillingCyclesDetails)
    public FilterMonthlyBillingCyclesDetails({ getState, patchState, dispatch }: StateContext<MonthlyBillingStateModel>, { filtration }: MONTHLY_BILLING_ACTIONS.FilterMonthlyBillingCyclesDetails) {
        patchState({
            monthlyBillingCyclesDetailsFiltration: { ...getState().monthlyBillingCyclesDetailsFiltration, ...filtration },
            monthlyBillingCyclesDetailsPagination: { ...getState().monthlyBillingCyclesDetailsPagination, pageIndex: 0 }
        })
        dispatch(new MONTHLY_BILLING_ACTIONS.GetMonthlyBillingCyclesDetails());
    }

    @Action(MONTHLY_BILLING_ACTIONS.ExportMonthlyBillingCyclesDetailsAsExcel)
    public ExportMonthlyBillingCyclesDetailsAsExcel({ getState }: StateContext<MonthlyBillingStateModel>) {
        const filtration = { ...getState().monthlyBillingCyclesDetailsFiltration };
        return this._mainService.exportMonthlyBillingCyclesDetailsAsExcel(filtration).pipe(
            tap(res => downloadFile(res.body, `Resources Billed on ${filtration.month}-${filtration.year}.xlsx`))
        )

    }

    /*__________________________________________ Unassociated Subordinates REDUCERS___________________________________*/

    @Action(MONTHLY_BILLING_ACTIONS.GetUnassociatedSubsCount)
    public GetUnassociatedSubsCount({ patchState }: StateContext<MonthlyBillingStateModel>, { filtration }: MONTHLY_BILLING_ACTIONS.GetUnassociatedSubsCount) {
        const pagination: PaginationConfigModel = {
            pageIndex: 0,
            pageSize: 1
        }
        return this._mainService.GetUnassociatedSubs(pagination, filtration).pipe(
            tap(({ recordsTotalCount: unassociatedSubsCount }: PaginationModel<MONTHLY_BILLING_CYCLES_MODELS.UnassociatedSubsModel>) => {
                patchState({unassociatedSubsCount})
            })
        )
    }

    @Action(MONTHLY_BILLING_ACTIONS.GetUnassociatedSubs)
    public GetUnassociatedSubs({ getState, patchState }: StateContext<MonthlyBillingStateModel>) {
        const { unassociatedSubsPagination: { pageIndex, pageSize } } = getState();
        const unassociatedSubsFiltration = getState().unassociatedSubsFiltration;
        return this._mainService.GetUnassociatedSubs({ pageIndex, pageSize }, unassociatedSubsFiltration).pipe(
            tap(
                ({
                    recordsTotalCount,
                    pageIndex,
                    pageSize,
                    previousPage,
                    totalPages,
                    records: unassociatedSubs
                }: PaginationModel<MONTHLY_BILLING_CYCLES_MODELS.UnassociatedSubsModel>) => {
                    patchState({
                        unassociatedSubs,
                        unassociatedSubsPagination: {
                            recordsTotalCount,
                            totalPages,
                            pageIndex,
                            pageSize,
                            previousPageIndex: previousPage,
                        }
                    })
                })
        )
    }

    @Action(MONTHLY_BILLING_ACTIONS.PaginateUnassociatedSubs)
    public PaginateUnassociatedSubs({ patchState, dispatch }: StateContext<MonthlyBillingStateModel>, { unassociatedSubsPagination }: MONTHLY_BILLING_ACTIONS.PaginateUnassociatedSubs){
        patchState({ unassociatedSubsPagination });
        dispatch(new MONTHLY_BILLING_ACTIONS.GetUnassociatedSubs())
    }
    
    @Action(MONTHLY_BILLING_ACTIONS.FilterUnassociatedSubs)
    public FilterUnassociatedSubs({ getState, patchState, dispatch }: StateContext<MonthlyBillingStateModel>, { unassociatedSubsFiltration }: MONTHLY_BILLING_ACTIONS.FilterUnassociatedSubs){
        patchState({
            unassociatedSubsFiltration: {...getState().unassociatedSubsFiltration, ...unassociatedSubsFiltration},
            unassociatedSubsPagination: {...getState().unassociatedSubsPagination, pageIndex: 0}
        })
        dispatch(new MONTHLY_BILLING_ACTIONS.GetUnassociatedSubs())
    }

    @Action(MONTHLY_BILLING_ACTIONS.ToggleShowAmount)
    public ToggleShowAmount({ patchState, getState}:StateContext<MonthlyBillingStateModel>){
      patchState({showBillingRateAndAmount : !getState().showBillingRateAndAmount})
    }
    
    @Action(MONTHLY_BILLING_ACTIONS.AddDiscountForResource)
  public AddDiscountForResource(
    ctx: StateContext<MONTHLY_BILLING_CYCLES_MODELS.DiscountModel>,
    { payload }: MONTHLY_BILLING_ACTIONS.AddDiscountForResource
  ) {
    return this._mainService.AddDiscountForResource(payload);
  }

  @Action(MONTHLY_BILLING_ACTIONS.DeleteDiscountForResource)
  public DeleteDiscountForResource(
    ctx: StateContext<MONTHLY_BILLING_CYCLES_MODELS.DiscountModel>,
    { assignedProfileId }: MONTHLY_BILLING_ACTIONS.DeleteDiscountForResource
  ) {
    return this._mainService.DeleteDiscountForResource(assignedProfileId);
  }
  @Action(MONTHLY_BILLING_ACTIONS.UpdateDiscountForResource)
  public UpdateDiscountForResource(
    ctx: StateContext<MONTHLY_BILLING_CYCLES_MODELS.DiscountModel>,
    { payload }: MONTHLY_BILLING_ACTIONS.UpdateDiscountForResource
  ) {
    return this._mainService.UpdateDiscountForResource(payload);
  }
}
