import { RecoursesServerConfig, STSServerConfig } from './servers.config';
import { CRUD_ACTIONS, CRUD_CONFIRMING_MESSAGES, CRUD_ERRORS_MESSAGES, CRUD_PAGINATION_DEFAULTS, CRUD_SORT_TYPES, CRUD_SUCCESSFUL_MESSAGES, CRUD_TYPES_CODES } from './crud.config';

class AppConfig {

    public readonly APP_NAME = 'Customer Portal';

    // CRUD ACTIONS CONFIG
    public CRUD_CONFIG = {
        actions: CRUD_ACTIONS,
        successMessages: CRUD_SUCCESSFUL_MESSAGES,
        confirmationMessages: CRUD_CONFIRMING_MESSAGES,
        paginationDefaults: CRUD_PAGINATION_DEFAULTS,
        sort: CRUD_SORT_TYPES,
        errorsTypes: CRUD_TYPES_CODES,
        errorsMessages: CRUD_ERRORS_MESSAGES
    }

    // Communicated servers config
    public SERVERS_CONFIG = {
        STS: STSServerConfig,
        resources: RecoursesServerConfig
        
    }


    public ROUTES_CONFIG = {
        root: '/dashboard',
        login: '/guest/login',
        logout: '/guest/logout',
        unauthorized: '/unauthorized',
        forbidden: 'unexpected/forbidden',
    }
    constructor() {}
}

export const SSAConfigInst: AppConfig = new AppConfig();


