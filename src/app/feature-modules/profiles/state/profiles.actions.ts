import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import * as MY_TASKS_MODELS from '../models/profiles.model';
import { RequestTeamModel } from '../models/profiles.model';

export class setFilters {
  static readonly type = '[Profile] Set Filters';
  constructor(public payload: RequestTeamModel) {}
}
export class getProfiles {
  static readonly type = '[Profile] Get Profiles';
  constructor(public payload: RequestTeamModel) {}
}

export class PaginateMyTeams {
  static readonly type = '[Profile] Paginate Profiles';
  constructor(public pagination: PaginationConfigModel) {}
}

export class FilterProfiles {
  static readonly type = '[Profile] Filter Profiles';
}

export class getProfileById {
  static readonly type = '[Profile] Get Profile By Id';
  constructor(public id: string) {}
}

export class getSkills {
  static readonly type = '[Profile] Get Skills';
  constructor(public query: string) {}
}

export class setSpecificProfileDetails {
  static readonly type = '[Profile] Set Specific Profile Details';
}

export class resetFilters {
  static readonly type = '[Profile] Reset filters';
}

export class resetFiltersAndPagination {
  static readonly type = '[Profile] Reset filters and Pagination';
}
