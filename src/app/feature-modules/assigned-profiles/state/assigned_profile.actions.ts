import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import * as MY_TASKS_MODELS from '../models/assigned-profile.model';
import {
  RequestTeamModel,
  AssignedProfileFiltrationModel,
  GetMyTeamsFilteration,
  EndAssociationModel,
   EditEndAssociationModel,
   ChangeContractTypeBodyModel
} from '../models/assigned-profile.model';

export class setFilters {
  static readonly type = '[ASSIGNED-PROFILES] Set Filters';
  constructor(public payload: AssignedProfileFiltrationModel) {}
}
export class getAssignedProfiles {
  static readonly type = '[ASSIGNED-PROFILES] Get Assigned Profiles';
  constructor(public payload: RequestTeamModel) {}
}

export class paginateMyTeams {
  static readonly type = '[ASSIGNED-PROFILES] Paginate Assigned Profiles';
  constructor(public pagination: PaginationConfigModel) {}
}

export class filterAssignedProfiles {
  static readonly type = '[ASSIGNED-PROFILES] Filter Assigned Profiles';
  constructor(public withPagination?: boolean) {} // public filteration: MY_TASKS_MODELS.AssignedProfileFiltrationModel
}

export class deleteAssignedProfiles {
  static readonly type = '[ASSIGNED-PROFILES] Delete Assigned Profiles by Id';
  constructor(public profileId: string) {
    // console.log('profileId action', profileId);
  }
}

export class getAssignedProfileById {
  static readonly type = '[ASSIGNED-PROFILES] Get Profile By Id';
  constructor(public id: string) {}
}

export class setSpecificProfileDetails {
  static readonly type = '[ASSIGNED-PROFILES] Set Specific Profile Details';
}

export class getAllClients {
  static readonly type = '[ASSIGNED-PROFILES] Get All Clients';
}

export class getAllowedPortfolios {
  static readonly type = '[ASSIGNED-PROFILES] Get Allowed Portfolios';
  constructor(public clientId: string) {}
}

export class getAllowedTeams {
  static readonly type = '[ASSIGNED-PROFILES] Get Allowed Teams';
  constructor(public filteration: GetMyTeamsFilteration, public withPagination?: boolean) {}
}

export class resetFilters {
  static readonly type = '[ASSIGNED-PROFILES] Reset Filters';
}

export class EndAssociation {
  static readonly type = '[ASSIGNED-PROFILES] End Association';
  constructor(public payload: EndAssociationModel ) {
  }
}
export class EditEndAssociation {
  static readonly type = '[ASSIGNED-PROFILES] Edit End Association';
  constructor(public payload: EditEndAssociationModel ) {
  }
}
export class getDepartments {
  static readonly type = '[ASSIGNED-PROFILES] Get Departments';
}

export class GetDepartmentByPlatform {
  static readonly type = '[ASSIGNED-PROFILES] Get Departments By Platform';
  constructor(public platformId: string) {}
}

export class importExcel {
  static readonly type = '[ASSIGNED-PROFILES] Import Excel';
  constructor(public file: FormData) {}
}

export class exportExcel {
  static readonly type = '[ASSIGNED-PROFILES] Export Excel';
  constructor() {}
}

export class exportTemplateExcel {
  static readonly type = '[ASSIGNED-PROFILES] Export Template Excel';
  constructor() {}
}

export class ChangeContractType {
  static readonly type = '[ASSIGNED-PROFILES] Change Contract Type';
  constructor(public body: ChangeContractTypeBodyModel) { }
}
