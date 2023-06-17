import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import { tap } from 'rxjs/operators';
import { SSAConfigInst } from 'src/app/config/app.config';
import { AdminsAssignmentsService } from '../models/admins-assignments.service';
import * as ADMINS_ASSIGNMENTS_MODELS from './../models/admins-assignments.models'
import * as ADMINS_ASSIGNMENTS_ACTIONS from './admins-assignments.actions'
export class AdminsAssignmentsStateModel {
   public schedules: ADMINS_ASSIGNMENTS_MODELS.adminModel[];
   public pagination: PaginationConfigModel;
   public externalAdmins: ADMINS_ASSIGNMENTS_MODELS.ExternalAdminModel[];
   public internalAdmins: ADMINS_ASSIGNMENTS_MODELS.InternalAdminModel[];

   constructor() {
      this.schedules = null;
      this.pagination = {
         pageIndex: 0,
         pageSize: 10
      }
      this.externalAdmins = null;
      this.internalAdmins = null;
   }
}

/*_______________________________DEFINING STATE__________________________________*/

@Injectable()
@State<AdminsAssignmentsStateModel>({
   name: 'AdminsAssignments',
   defaults: new AdminsAssignmentsStateModel(),
})
export class AdminsAssignmentsState {
   constructor(private _mainService: AdminsAssignmentsService) { }

   /*__________________________________________SELECTORS___________________________________*/

   @Selector() static schedules(state: AdminsAssignmentsStateModel): ADMINS_ASSIGNMENTS_MODELS.adminModel[] { return state.schedules }
   @Selector() static SchedulesPagination(state: AdminsAssignmentsStateModel): PaginationConfigModel { return { ...state.pagination } }

   @Selector() static externalAdmins(state: AdminsAssignmentsStateModel): ADMINS_ASSIGNMENTS_MODELS.ExternalAdminModel[] { return state.externalAdmins }
   @Selector() static internalAdmins(state: AdminsAssignmentsStateModel): ADMINS_ASSIGNMENTS_MODELS.InternalAdminModel[] { return state.internalAdmins }

   /*_______________________________________REDUCERS____________________________________*/

   @Action(ADMINS_ASSIGNMENTS_ACTIONS.GetSchedules)
   public GetSchedules({ getState, patchState }: StateContext<AdminsAssignmentsStateModel>) {
      const { pagination: { pageIndex, pageSize } } = getState();
      return this._mainService.getSchedules({ pageIndex, pageSize }).pipe(
         tap(
            ({ records: schedules, recordsTotalCount,
               totalPages,
               pageIndex,
               pageSize,
               previousPage }: PaginationModel<ADMINS_ASSIGNMENTS_MODELS.adminModel>) => {
               patchState({
                  schedules,
                  pagination: {
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

   @Action(ADMINS_ASSIGNMENTS_ACTIONS.PaginateSchedules)
   public PaginateSchedules({ patchState, getState, dispatch }: StateContext<AdminsAssignmentsStateModel>, { pagination }: ADMINS_ASSIGNMENTS_ACTIONS.PaginateSchedules) {
      patchState({ pagination });
      dispatch(new ADMINS_ASSIGNMENTS_ACTIONS.GetSchedules())
   }

   @Action(ADMINS_ASSIGNMENTS_ACTIONS.GetAllExternalAdmins)
   public GetAllExternalAdmins({ patchState }: StateContext<AdminsAssignmentsStateModel>) {
      return this._mainService.getFilteredPage().pipe(
         tap((externalAdmins: ADMINS_ASSIGNMENTS_MODELS.ExternalAdminModel[]) => patchState({ externalAdmins }))
      )
   }

   @Action(ADMINS_ASSIGNMENTS_ACTIONS.GetAllInternalAdmins)
   public GetAllInternalAdmins({ patchState }: StateContext<AdminsAssignmentsStateModel>, { clientProfileId }: ADMINS_ASSIGNMENTS_ACTIONS.GetAllInternalAdmins) {
      return this._mainService.getInternalAdmins(clientProfileId).pipe(
         tap((internalAdmins: ADMINS_ASSIGNMENTS_MODELS.InternalAdminModel[]) => patchState({ internalAdmins }))
      )
   }

   @Action(ADMINS_ASSIGNMENTS_ACTIONS.ScheduleAnAdmin)
   public ScheduleAnAdmin({}: StateContext<AdminsAssignmentsStateModel>, { body }: ADMINS_ASSIGNMENTS_ACTIONS.ScheduleAnAdmin){
      return this._mainService.schedule(body).pipe(
         tap((res:boolean)=> res)
      )
   }

   @Action(ADMINS_ASSIGNMENTS_ACTIONS.UnscheduleAdmin)
   public UnscheduleAdmin({}: StateContext<AdminsAssignmentsStateModel>,{ id }: ADMINS_ASSIGNMENTS_ACTIONS.UnscheduleAdmin) {
      return this._mainService.unschedule(id).pipe(
         tap((res:boolean)=> res)
      )
   }

}
