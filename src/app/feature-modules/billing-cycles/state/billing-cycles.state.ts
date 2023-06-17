import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { tap } from 'rxjs/operators';
import { BillingCyclesService } from '../models/billing-cycles.service';
import * as BILLING_CYCLES from '../models/billing-cycles.models';
import * as BILLING_ACTIONS from './billing-cycles.actions'
import { downloadFile } from '@shared/helpers/download-file.helper';
import * as BILLING_CYCLES_MODELS from '@modules/billing-cycles/models/billing-cycles.models';

export class BillingStateModel {
   public billingCycles: BILLING_CYCLES.BillingCycleModel[];
   public selectedCycle: BILLING_CYCLES.BillingCycleModel;

   public cyclesPagination: PaginationConfigModel;
   public cyclesSearchQuery: string;


   public billingCycleId: string;
   public poDetails: BILLING_CYCLES_MODELS.BillingCycleDetailsModel[];
   public poPagination: PaginationConfigModel;
   public poSearchQuery: string;
   public showAmount: boolean
   public showBillingRateAndAmount: boolean

   constructor() {
      this.billingCycles = [];
      this.cyclesPagination = {
         pageIndex: 0,
         pageSize: 10
      }
      this.cyclesSearchQuery = '';
      this.selectedCycle = null;
      this.billingCycleId = null;
      this.poDetails = [];
      this.poPagination = {
         pageIndex: 0,
         pageSize: 10
      }
      this.poSearchQuery = '';
      this.showAmount = false;
      this.showBillingRateAndAmount = false;
   }
}

@Injectable()
@State<BillingStateModel>({
   name: 'BillingCycles',
   defaults: new BillingStateModel()
})

export class BillingCyclesState {
   constructor(private _mainService: BillingCyclesService) { }

   /* __________________________________________SELECTORS___________________________________*/

   @Selector() static billingCycles(state: BillingStateModel): BILLING_CYCLES.BillingCycleModel[] { return state.billingCycles }
   @Selector() static cyclesPagination(state: BillingStateModel): PaginationConfigModel { return { ...state.cyclesPagination } }
   @Selector() static cyclesSearchQuery(state: BillingStateModel): string { return state.cyclesSearchQuery }
   @Selector() static selectedCycle(state: BillingStateModel): BILLING_CYCLES.BillingCycleModel { return state.selectedCycle }

   @Selector() static poDetails(state: BillingStateModel): BILLING_CYCLES_MODELS.BillingCycleDetailsModel[] { return state.poDetails }
   @Selector() static poPagination(state: BillingStateModel): PaginationConfigModel { return { ...state.poPagination } }
   @Selector() static poSearchQuery(state: BillingStateModel): string { return state.poSearchQuery };
   @Selector() static showAmount(state: BillingStateModel): boolean { return state.showAmount }
   @Selector() static showBillingRateAndAmount(state: BillingStateModel): boolean { return state.showBillingRateAndAmount }

   /*_______________________________________REDUCERS____________________________________*/

   /*_____________________ Get Billing Cycle Page Reducers _____________________ */
   @Action(BILLING_ACTIONS.GetFilteredPage)
   public GetFilteredPage({ getState, patchState }: StateContext<BillingStateModel>) {
      const { cyclesPagination: { pageIndex, pageSize }, cyclesSearchQuery } = getState();
      return this._mainService.getFilteredPage({ pageIndex, pageSize }, cyclesSearchQuery).pipe(
         tap(
            ({ records: billingCycles, recordsTotalCount,
               totalPages,
               pageIndex,
               pageSize,
               previousPage }: PaginationModel<BILLING_CYCLES.BillingCycleModel>) => {
               patchState({
                  billingCycles,
                  cyclesPagination: {
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

   @Action(BILLING_ACTIONS.PaginateFilteredPage)
   public PaginateFilteredPage({ patchState, dispatch }: StateContext<BillingStateModel>, { cyclesPagination }: BILLING_ACTIONS.PaginateFilteredPage) {
      patchState({ cyclesPagination });
      dispatch(new BILLING_ACTIONS.GetFilteredPage());
   }

   @Action(BILLING_ACTIONS.SearchFilteredPage)
   public SearchFilteredPage({ dispatch, patchState, getState }: StateContext<BillingStateModel>, { cyclesSearchQuery }: BILLING_ACTIONS.SearchFilteredPage) {
      patchState({
         cyclesSearchQuery,
         cyclesPagination: { ...getState().cyclesPagination, pageIndex: 0 }
      });
      dispatch(new BILLING_ACTIONS.GetFilteredPage())
   }

   @Action(BILLING_ACTIONS.ExportAsExcel)
   public ExportAsExcel({ getState }: StateContext<BillingStateModel>) {
      const searchQuery = getState().cyclesSearchQuery;
      let name = 'Billing Cycles';
      if (searchQuery) name += ` of${searchQuery}`
      return this._mainService.exportAsExcel(searchQuery).pipe(
         tap(res => downloadFile(res.body, `${name}.xlsx`))
      )
   }


   /*_____________________ Get PO Cycle Details Reducers _____________________ */

   @Action(BILLING_ACTIONS.SetBillingCycleId)
   public SetBillingCycleId({ patchState, dispatch }: StateContext<BillingStateModel>, { billingCycleId }: BILLING_ACTIONS.SetBillingCycleId) {
      patchState({ billingCycleId });
      dispatch([new BILLING_ACTIONS.GetBillingCycleDetails(), new BILLING_ACTIONS.GetBillingCycleById()])
   }

   @Action(BILLING_ACTIONS.GetBillingCycleById)
   public GetBillingCycleById({ getState, patchState }: StateContext<BillingStateModel>) {
      const { billingCycleId } = getState();
      return this._mainService.getById(billingCycleId).pipe(
         tap(
            (selectedCycle: BILLING_CYCLES_MODELS.BillingCycleModel) => patchState({ selectedCycle })
         ))
   }

   @Action(BILLING_ACTIONS.GetBillingCycleDetails)
   public GetBillingCycleDetails({ getState, patchState }: StateContext<BillingStateModel>) {
      const { poPagination: { pageIndex, pageSize } } = getState();
      const filtration: BILLING_CYCLES_MODELS.BillingCycleDetailsFiltrationModel = {
         billingCycleId: getState().billingCycleId,
         searchQuery: getState().poSearchQuery
      }
      return this._mainService.getBillingCycleDetails({ pageIndex, pageSize }, filtration).pipe(
         tap(
            ({ records: poDetails, recordsTotalCount,
               totalPages,
               pageIndex,
               pageSize,
               previousPage }: PaginationModel<BILLING_CYCLES_MODELS.BillingCycleDetailsModel>) => {
               patchState({
                  poDetails,
                  poPagination: {
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

   
   @Action(BILLING_ACTIONS.PaginateBillingCycleDetails)
   public PaginateBillingCycleDetails({ patchState, dispatch }: StateContext<BillingStateModel>, { poPagination }: BILLING_ACTIONS.PaginateBillingCycleDetails) {
      patchState({ poPagination });
      dispatch(new BILLING_ACTIONS.GetBillingCycleDetails());
   }

   @Action(BILLING_ACTIONS.SearchBillingCycleDetails)
   public SearchBillingCycleDetails({ dispatch, patchState, getState }: StateContext<BillingStateModel>, { poSearchQuery }: BILLING_ACTIONS.SearchBillingCycleDetails) {
      patchState({
         poSearchQuery,
         poPagination: { ...getState().poPagination, pageIndex: 0 }
      });
      dispatch(new BILLING_ACTIONS.GetBillingCycleDetails())
   }

   @Action(BILLING_ACTIONS.ExportBillingCycleDetailsAsExcel)
   public ExportBillingCycleDetailsAsExcel({ getState }: StateContext<BillingStateModel>) {
      const filtration: BILLING_CYCLES_MODELS.BillingCycleDetailsFiltrationModel = {
         billingCycleId: getState().billingCycleId,
         searchQuery: getState().poSearchQuery
      }
      let fileName = `Resources of ${getState()?.selectedCycle?.name}`;
      return this._mainService.exportBillingCycleDetailsAsExcel(filtration).pipe(
         tap(res => downloadFile(res.body, `${fileName}.xlsx`))
      )
   }

   @Action(BILLING_ACTIONS.ToggleShowAmount)
   public ToggleShowAmount({ patchState, getState}:StateContext<BillingStateModel>){
     patchState({showAmount : !getState().showAmount})
   }

   @Action(BILLING_ACTIONS.ToggleShowBillingRateAndAmount)
   public ToggleShowBillingRate({ patchState, getState}:StateContext<BillingStateModel>){
     patchState({showBillingRateAndAmount : !getState().showBillingRateAndAmount})
   }

   @Action(BILLING_ACTIONS.AddDiscountForResource)
   public AddDiscountForResource(
     ctx: StateContext<BILLING_CYCLES_MODELS.DiscountModel>,
     { payload }: BILLING_ACTIONS.AddDiscountForResource
   ) {
     return this._mainService.AddDiscountForResource(payload);
   }
   @Action(BILLING_ACTIONS.DeleteDiscountForResource)
   public DeleteDiscountForResource(
     ctx: StateContext<BILLING_CYCLES_MODELS.DiscountModel>,
     { assignedProfileId }: BILLING_ACTIONS.DeleteDiscountForResource
   ) {
     return this._mainService.DeleteDiscountForResource(assignedProfileId);
   }
   @Action(BILLING_ACTIONS.UpdateDiscountForResource)
   public UpdateDiscountForResource(
     ctx: StateContext<BILLING_CYCLES_MODELS.DiscountModel>,
     { payload }: BILLING_ACTIONS.UpdateDiscountForResource
   ) {
     return this._mainService.UpdateDiscountForResource(payload);
   }
}

