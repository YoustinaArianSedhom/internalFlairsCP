export interface PermissionModel {
    name: string;
    route?: string;
    action?: object;
    roles: string[];
}

export interface PermissionsListModel {
    [name: string]: PermissionModel;
}


export interface SystemRolesModel {
    updatableRoles: string[];
    nonUpdatableRoles: string[];
}




