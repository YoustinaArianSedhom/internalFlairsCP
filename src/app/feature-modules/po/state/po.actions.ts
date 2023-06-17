import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import * as PO_MODEL from "../models/po.models";
 
export class POAdd {
  static readonly type = '[PO] PO Add';
  constructor(public formData: FormData) {}
}
export class POUpdate {
  static readonly type = '[PO] PO Update';
  constructor(public formData: FormData) {}
}
export class GetAllTeams{
  static readonly type = '[PO] Get All Teams';
  constructor(public model:PO_MODEL.TeamFiltrationModel) {}
}


export class GetAllClients {
  static readonly type = '[PO] Get All Clients';
  constructor(public value: string) {}
}

export class GetAllPortfolios
{
  static readonly type = '[PO] Get All Portfolios';
  constructor(public value: string) {}
}

export class GetAllPortfoliosByKey{
  static readonly type = '[PO] Get All Portfolios by key';
  constructor(public value: string,public search:string) {}
}

export class GetAllInternalManagers{
  static readonly type = '[PO] Get All internal Admins';
  constructor(public search: string,public body:PO_MODEL.FliterManger) {}
}

export class GetAllExternalAdmins {
  static readonly type = '[PO] Get All External Admins';
  constructor(public search: string,public body:PO_MODEL.FliterManger) {}
}

export class GetAllPO {
  static readonly type = '[PO] Get PO';
}

export class PaginatePO{
  static readonly type = '[PO] Paginate PO';
  constructor(public pagination: PaginationConfigModel) {}
}

export class GetDepartmentByPlatform {
  static readonly type = '[PO] Get Departments By Platform';
  constructor(public platformId: string) {}
}

export class SearchFilteredPage {
  static readonly type = '[PO] Search Filtered Page';
  constructor( public searchQuery: string) { }
}

export class GetFilteredPage {
  static readonly type = '[PO] Get Filtered Page';
}

export class GetPOById{
  static readonly type = '[PO] Get By Id';
  constructor( public poId: string) { }
}
 
export class GetCurrencies{
  static readonly type = '[PO] Get Currencies';
  constructor( public query: string) { }
}
export class GetAssignedProfileRoles{
  static readonly type = '[PO] Get Assigned Profile Roles';
}
export class GetLocations{
  static readonly type = '[PO] Get Locations';
}

export class DownloadNewAssociationTemplate {
  static readonly type = '[PO] Download New Association Template'
}

export class ImportNewAssociationFromExcel {
  static readonly type = '[PO] Import New Association From Excel'
  constructor(public formData: FormData) {}
}
export class ToggleShowTotalAmount {
  static readonly type = '[PO] Toggle Show Total Amount';
}