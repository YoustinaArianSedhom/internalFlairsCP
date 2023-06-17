// tslint:disable-next-line: no-namespace
export interface ConfirmationDialogDataModel {
    title: string;
    content: string;
    proceedText?: string;
    cancelText?: string;
    noCancelButton?: boolean;
    class?: string;
    hint?: string
}

export interface FeedbackDialogDataModel {
    title: string;
    content: string;
    status: string;
    autoDismissTime?: number;
}

export interface InputDialogDataModel<T = any> {
    title: string;
    type?: string;
    value?: string;
    autocompleteOptions?: T[];
    autocompleteFiltrationParam?: string;
    placeholder?: string;
    proceedText?: string;
    cancelText?: string;
    isRating?: boolean;
    selectOptions?: T[];
    isSelect?: boolean;
    inputAutocomplete?: string;
}

export interface RatingDialogDataModel<T = any> {
    title: string;
    type?: string;
    value?: any;
    autocompleteOptions?: T[];
    autocompleteFiltrationParam?: string;
    rating: number;
    placeholder?: string;
    proceedText?: string;
    cancelText?: string;
    isEdit?: boolean;
}
