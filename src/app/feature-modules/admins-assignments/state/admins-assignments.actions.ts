import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import * as ADMINS_ASSIGNMENTS_MODELS from '@modules/admins-assignments/models/admins-assignments.models';

export class GetSchedules {
   static readonly type = '[Admins-Assignments] Get Schedules';
}

export class PaginateSchedules{
   static readonly type = '[Admins-Assignments] Paginate Schedules';
   constructor(public pagination: PaginationConfigModel) {}
}

export class GetAllExternalAdmins {
   static readonly type = '[Admins-Assignments] Get All External Admins';
}

export class GetAllInternalAdmins{
   static readonly type = '[Admins-Assignments] Get All Internal Admins';
   constructor(public clientProfileId: string) {}
}

export class ScheduleAnAdmin {
   static readonly type = '[Admins-Assignments] Schedule An Admin';
   constructor(public body: ADMINS_ASSIGNMENTS_MODELS.adminAssignmentFormBodyModel) {}
}

export class UnscheduleAdmin {
   static readonly type = '[Admins-Assignments] UnSchedule Admin';
   constructor( public id: string) { }

}
