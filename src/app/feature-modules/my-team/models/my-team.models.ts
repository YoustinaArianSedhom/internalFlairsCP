export interface ManagerModel {
    id: string;
    fullName: string;
    organizationEmail: string;
}

export interface MyTeamFiltrationModel {
    searchQuery?: string;
    directOnly?: boolean;
    associationCount?: number;
    assignedProfileStatus?: boolean;
    managerIds?: string[];
}

export interface MyTeamModel {
    id: string;
    fullName: string;
    title: string;
    associationCount: number;
    managerFullName: string;
    currentAssociationStatus: number;
}
