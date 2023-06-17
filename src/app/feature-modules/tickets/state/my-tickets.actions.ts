import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import * as MY_TASKS_MODELS from '../models/my-tickets.model';
import { RequestTeamModel } from '../models/my-tickets.model';

export class setClientId {
  static readonly type = '[MY-TICKETS] Set Client ID';
  constructor(public clientID: string) {}
}

export class setFilters {
  static readonly type = '[MY-TICKETS] Set Filters';
  constructor(public payload: RequestTeamModel) {}
}
export class GetMyTickets {
  static readonly type = '[MY-TICKETS] Get My Tickets';
  constructor(public payload: RequestTeamModel) {}
}

export class GetMyInternalTickets {
  static readonly type = '[MY-TICKETS] Get My Internal Tickets';
  constructor(public payload: RequestTeamModel) {}
}

export class GetContacts {
  static readonly type = '[MY-TICKETS] Get Contacts';
  constructor(public query: string) {}
}

export class GetRoles {
  static readonly type = '[MY-TICKETS] Get Roles';
  constructor(public query: string) {}
}

export class PaginateMyTeams {
  static readonly type = '[MY-TICKETS] Paginate My Tasks';
  constructor(public pagination: PaginationConfigModel) {}
}

export class PaginateMyInternalTickets {
  static readonly type = '[MY-TICKETS] Paginate My Internal Tickets';
  constructor(public pagination: PaginationConfigModel) {}
}

export class FilterMyTickets {
  static readonly type = '[MY-TICKETS] Filter My Tickets';
}

export class FilterMyInternalTickets {
  static readonly type = '[MY-TICKETS] Filter My Internal Tickets';
}

export class SearchMyTeams {
  static readonly type = '[MY-TICKETS] Search My Tasks';
  constructor(public searchQuery: string) {}
}

export class SortMyTeams {
  static readonly type = '[MY-TICKETS] Sort My Tasks';
  constructor(public sort: TableColumnSortModel) {}
}

export class TakeActionOnTeam {
  static readonly type = '[MY-TICKETS] Take Action On Task ';
  constructor(public takeActionsParams: MY_TASKS_MODELS.MyTasksActionTaken) {}
}

export class getSkills {
  static readonly type = '[MY-TICKETS] Get Skills ';
  constructor(public query: string) {}
}

export class getAllClients {
  static readonly type = '[MY-TICKETS] Get All Clients ';
}

export class getAllPortfolios {
  static readonly type = '[MY-TICKETS] Get All Portfolios ';
  constructor(public clientId: string) {}
}

export class resetFilters {
  static readonly type = '[MY-TICKETS] Reset Filters ';
}

export class resetFiltersAndPagination {
  static readonly type = '[MY-TICKETS] Reset Filters and Pagination';
}

export class setMode {
  static readonly type = '[MY-TICKETS] Set Mode';
  constructor(public mode: string) {}
}

export class setSelectedPortfolioId {
  static readonly type = '[MY-TICKETS] Set Selected Portfolio Id';
  constructor(public id: string) {}
}
