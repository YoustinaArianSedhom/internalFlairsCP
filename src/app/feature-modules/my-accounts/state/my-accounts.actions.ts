import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import * as MY_TASKS_MODELS from '../models/my-accounts.model';
import { RequestTeamModel } from '../models/my-accounts.model';

export class setClientId {
  static readonly type = '[MY-TEAMS] Set Client ID';
  constructor(public clientID: string) {}
}

export class setFilters {
  static readonly type = '[MY-TEAMS] Set Filters';
  constructor(public payload: RequestTeamModel) {}
}
export class GetMyTeams {
  static readonly type = '[MY-TEAMS] Get My Teams';
  constructor(public payload: RequestTeamModel) {}
}

export class GetAssignedPortfolios {
  static readonly type = '[MY-TEAMS] Get Assigned Team Portfolios';
  constructor(public clientId: string) {}
}

export class GetAssignedTeams {
  static readonly type = '[MY-TEAMS] Get Assigned Teams';
  constructor(public accountId: string, public portfolioId: string) {}
}

export class PaginateMyTeams {
  static readonly type = '[MY-TEAMS] Paginate My Teams';
  constructor(public pagination: PaginationConfigModel) {}
}

export class FilterMyTeams {
  static readonly type = '[MY-TEAMS] Filter My Teams';
  // constructor(public filtration: MY_TASKS_MODELS.RequestTeamModel) {}
}

export class SearchMyTeams {
  static readonly type = '[MY-TEAMS] Search My Teams';
  constructor(public searchQuery: string) {}
}

export class SortMyTeams {
  static readonly type = '[MY-TEAMS] Sort My Teams';
  constructor(public sort: TableColumnSortModel) {}
}

export class TakeActionOnTeam {
  static readonly type = '[MY-TEAMS] Take Action On Task ';
  constructor(public takeActionsParams: MY_TASKS_MODELS.MyTasksActionTaken) {}
}

export class getSkills {
  static readonly type = '[MY-TEAMS] Get Skills ';
  constructor(public query: string) {}
}

export class resetSearch {
  static readonly type = '[MY-TEAMS] Reset Search';
}

export class setTeamIds {
  static readonly type = '[MY-TEAMS] Set TeamIds';
  constructor(public TeamIDS: any[]) {}
}

export class ResetTeamsAndPortfolios {
  static readonly type = '[MY-TEAMS] Reset Teams and Portfolio';
}

export class resetFiltersAndPagination {
  static readonly type = '[MY-TEAMS] Reset Filters and Pagination';
}
