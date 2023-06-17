export interface SnackBarConfigModel {
    name?: string;
    context?: string;
    color?: string;
    action?: string;
    message?: string;
    icon?: string;
    showCloseBtn?: boolean;
    duration?: number;
    type?: string;
    panelClasses?: string[];
}
