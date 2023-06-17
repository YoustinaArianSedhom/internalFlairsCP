export interface TableConfigModel {
    actionsLabel?: string;
    actions: TableActionModel[];
    keys: string[];
    columns: Array<TableColumnModel>;
    disableActionsCell?: (record: any) => boolean
}

export interface TableColumnModel {
    key: string;
    head: string;
    sort?: TableColumnSortModel;
    value: (record: any, parameter?: any) => any;
    extraInfoValue?: (record: any, parameter?: any) => any;
    view?: {
        width: number,
        bodyCell?: {
            align: string;
            classes?: string | Function;
            extraInfoClasses?: string | Function
        };
        headCell: {
            align: string;
            classes?: string;
        },
        footerCell?: {
            align: string;
            classes?: string;
        }
    };
    type?: string;
    hidden?: boolean;
}


export interface TableActionModel {
    key: string;
    label: string;
    icon?: ActionIconModel;
    active?: boolean;
    hideCondition?: (record: any, column: TableColumnModel) => boolean;
    disableCondition?: (record: any, column: TableColumnModel) => boolean;
}


interface ActionIconModel {
    name: string;
    isSVG?: boolean;
    classes?: string
}

export interface tableTakenActionModel {
    record: any;
    action: TableActionModel
}


export interface TableLinkCellModel {
    label?: string;
    title?: string;
    link?: string;
}

export interface TableAdditionDeductionCellModel {
    details: any[];
    type: string;
    value: number;
    action: TableActionModel
}

export interface tableWithNoteCellModel {
    value: string;
    note: string;
}


export interface TableColumnSortModel {
    sortField: number;
    sortType: number;
    disableClear?: boolean;
}


