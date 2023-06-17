export interface BasicSelectOptionModel {
    id: number;
    name: string;
}


export interface BasicSelectConfigModel {
    placeholder: string;
    multiple: boolean;
    value: string | string[] | number | number[];
    options?: BasicSelectOptionModel[];
    nonFormattedOptions?: {[key in string | number]: string}
}