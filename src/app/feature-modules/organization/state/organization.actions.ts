import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import * as Clients_MODELS from '../models/clients.models';
// import { RequestTeamModel } from '../models/clients.config';

export class getClients {
  static readonly type = '[Client] Get Clients';
  constructor(public payload: Clients_MODELS.Filtration) {}
}

export class getAdmins {
  static readonly type = '[Client] Get Admins';
  constructor(public id: string) {}
}

export class getPortfolios {
  static readonly type = '[Client] Get Portfolios';
  constructor(public payload: Clients_MODELS.Filtration) {}
}

export class getTeams {
  static readonly type = '[Client] Get Teams';
  constructor(public payload: Clients_MODELS.Filtration) {}
}

export class getDepartments {
  static readonly type = '[Client] Get Departments';
}

export class getAssignedProfilesByTeam {
  static readonly type = '[Client] Get Assigned Profiles By Team';
  constructor(public payload: Clients_MODELS.Filtration) {}
}

export class getAssignedProfilesById {
  static readonly type = '[Client] Get Assigned Profiles By Id';
  constructor(public id: string) {}
}

export class setFilters {
  static readonly type = '[Client] Set Filters';
  constructor(public payload: Clients_MODELS.Filtration) {}
}

export class FilterOrganization {
  static readonly type = '[Client] Filter Organization';
}

export class PaginateClients {
  static readonly type = '[Client] Paginate Clients';
  constructor(public pagination: PaginationConfigModel) {}
}

export class PaginatePortfolios {
  static readonly type = '[Client] Paginate Portfolios';
  constructor(public pagination: PaginationConfigModel) {}
}

export class PaginateTeams {
  static readonly type = '[Client] Paginate Teams';
  constructor(public pagination: PaginationConfigModel) {}
}

export class PaginateAdmins {
  static readonly type = '[Client] Paginate Admins';
  constructor(public pagination: PaginationConfigModel, public id: string) {}
}

export class PaginateAssignedProfiles {
  static readonly type = '[Client] Paginate AssignedProfiles';
  constructor(public pagination: PaginationConfigModel) {}
}

export class getEntities {
  static readonly type = '[Client] Get Entities';
}

export class changeTableMode {
  static readonly type = '[Client] Change Table Mode';
  constructor(public tableMode: number) {}
}

export class setClientSelected {
  static readonly type = '[Client] Set Client Selected';
  constructor(public Client: Clients_MODELS.Client) {}
}

export class setPortfolioSelected {
  static readonly type = '[Client] Set Portfolio Selected';
  constructor(public Portfolio: Clients_MODELS.Portfolios) {}
}

export class setTeamSelected {
  static readonly type = '[Client] Set Team Selected';
  constructor(public Team: Clients_MODELS.Teams) {}
}

export class setDepartmentSelected {
  static readonly type = '[Client] Set Department Selected';
  constructor(public Department: Clients_MODELS.Department) {}
}

export class resetClientSelected {
  static readonly type = '[Client] Reset Client Selected';
}

export class resetPortfolioSelected {
  static readonly type = '[Client] Reset Portfolio Selected';
}

export class resetTeamSelected {
  static readonly type = '[Client] Reset Team Selected';
}

export class resetDepartmentSelected {
  static readonly type = '[Client] Reset Department Selected';
}

export class searchClient {
  static readonly type = '[Client] Search Clients';
}

export class searchPortfolios {
  static readonly type = '[Client] Search Portfolios';
}

export class searchTeams {
  static readonly type = '[Client] Search Teams';
}

export class getClientsIDS {
  static readonly type = '[Client] Get list of Clients';
  constructor(public query: string) {}
}

export class getPortfoliosIDS {
  static readonly type = '[Client] Get list of Portfolios';
  constructor(public query: string) {}
}

export class getTeamsIDS {
  static readonly type = '[Client] Get list of Teams';
  constructor(public query: string) {}
}

export class getTree {
  static readonly type = '[Client] Get Tree of clients';
}

export class resetSearchQuery {
  static readonly type = '[Client] Reset search query';
}

export class resetFilters {
  static readonly type = '[Client] Reset Filters';
}

export class getAndSetClientById {
  static readonly type = '[Client] Get And Set Client By Id';
  constructor(public id: string) {}
}

export class getAndSetPortfolioById {
  static readonly type = '[Client] Get And Set Portfolio By Id';
  constructor(public id: string) {}
}

export class getAndSetDepartmentById {
  static readonly type = '[Client] Get And Set Department By Id';
  constructor(public id: string) {}
}
