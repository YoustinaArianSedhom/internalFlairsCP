export interface HeadInformationModel {
    title: string;
    description?: string;
}


export interface HeadRefresherConfigModel {
    url: {
        enabled: boolean;
        dynamic: boolean;
    },
    prefix: string;
}

export type HeadRefresherType = {
    headInformation: HeadInformationModel;
    refreshHeadInformation(config?: HeadInformationModel): void 
}