import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import * as MY_TEAM_MODELS from '../models/my-team.models'


export class GetMyTeamPage {
    static readonly type = '[My Team] Get My Team Page';
}

export class PaginateMyTeam {
    static readonly type = '[My Team] Paginate My Team';
    constructor(public teamPagination: PaginationConfigModel) { }
}

export class SetTeamFilters {
    static readonly type = '[My Team] Set My Team Filters'
    constructor(public payload: MY_TEAM_MODELS.MyTeamFiltrationModel) { }
}

export class GetManagers {
    static readonly type = '[My Team] Get Managers'
    constructor(public query: string){}
}
