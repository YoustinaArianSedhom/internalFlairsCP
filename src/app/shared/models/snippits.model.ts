export interface IconConfigModel {
    name: string;
    isSVG?: boolean;
    classes?: string;
}

export interface DatePickerConfigModel {
    readonly current?: Date;
    readonly max?: Date;
    readonly min?: Date;
}