import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import * as CLIENTS_MANAGEMENT_MODELS from '../models/clients-management.models';
// import { RequestTeamModel } from '../models/clients.config';

export class getClients {
  static readonly type = '[Client-Management] Get Clients';
  constructor(public payload: CLIENTS_MANAGEMENT_MODELS.Filtration) {}
}

export class GetAdmins {
  static readonly type = '[Client-Management] Get Admins';
  constructor(public payload: CLIENTS_MANAGEMENT_MODELS.Filtration) {}
}

export class getInternalAdmins {
  static readonly type = '[Client-Management] Get Internal Admins';
  constructor(
    public payload: CLIENTS_MANAGEMENT_MODELS.InternalAdminsFiltration
  ) {}
}

export class setFilters {
  static readonly type = '[Client-Management] Set Filters';
  constructor(public payload: CLIENTS_MANAGEMENT_MODELS.Filtration) {}
}

export class setInternalAdminFilters {
  static readonly type = '[Client-Management] Set Internal Admin Filters';
  constructor(
    public payload: CLIENTS_MANAGEMENT_MODELS.InternalAdminsFiltration
  ) {}
}

export class FilterAdmins {
  static readonly type = '[Client-Management] Filter Admins';
}

export class FilterInternalAdmins {
  static readonly type = '[Client-Management] Filter Internal Admins';
}

export class PaginateAdmins {
  static readonly type = '[Client-Management] Paginate Admins';
  constructor(public pagination: PaginationConfigModel) {}
}

export class PaginateInternalAdmins {
  static readonly type = '[Client-Management] Paginate Internal Admins';
  constructor(public pagination: PaginationConfigModel) {}
}

export class getClientsIDS {
  static readonly type = '[Client-Management] Get list of Clients';
}

export class resetFilters {
  static readonly type = '[Client-Management] Reset Filters';
}

export class resetInternalAdminFilters {
  static readonly type = '[Client-Management] Reset Internal Admin Filters';
}

export class getAllowedPortfolios {
  static readonly type = '[Client-Management] Get Allowed Portfolios';
  constructor(public clientId: string) {}
}

export class getAllowedTeams {
  static readonly type = '[Client-Management] Get Allowed Teams';
  constructor(
    public filteration: CLIENTS_MANAGEMENT_MODELS.GetMyTeamsFilteration
  ) {}
}

export class changeMode {
  static readonly type = '[Client-Management] ChangeMode';
  constructor(public Mode: string) {}
}
