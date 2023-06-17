import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { validationErrorMessages } from '../config/validation-messages';

@Component({
    selector: "app-validation-error",
    templateUrl: "./validation-error.component.html",
    styleUrls: []
})
export class ValidationErrorComponent implements OnInit {
    constructor() { }

    @Input() control: FormControl|AbstractControl = new FormControl;  // Control which we will run functionality on
    @Input() businessName: string | null = null; // Used instead control name incase of control name is not readable
    @Input() customMessage: string | null = null; // Used instead of default error message incase you wanna overwrite it on specific scenario
    @Input() customValidatorsErrorMessages: { [key: string]: string } = {}; // Bunch of error messages that not provide by component
        


    ngOnInit() {
        // Set the field name
        this.businessName = this.businessName || this._getControlName();
    }

    /**
     * 
     * @param errors -> Control errors which returned by angular after running specific validation rules over it
     */
    getErrorMessage(errors: ValidationErrors = {}): string {
        const keys = Object.keys(errors); // -> keys of errors
        let conditionValue = null; // -> the extra input which will help into outputting more descriptive message
        
        // Predefined Error messages plus messages passed by user
        const totalValidationErrorMessages = { ...validationErrorMessages, ...this.customValidatorsErrorMessages };
        


        // Setting condition value for validation message which required an extra input
        switch (keys[0]) {
            case 'min':
                conditionValue = errors?.min?.min;
                break;
            case 'max':
                conditionValue = errors?.max?.max;
                break;
            case 'minNumber':
                conditionValue = errors?.minNumber;
                break;
            case 'maxNumber':
                conditionValue = errors?.maxNumber;
                break;
            case 'minContentSize':
                conditionValue = errors?.minContentSize;
                break;
            case 'maxContentSize':
                conditionValue = errors?.maxContentSize;
                break;
            case 'minlength':
                conditionValue = errors?.minlength?.requiredLength;
                break;
            case 'maxlength':
                conditionValue = errors?.maxlength?.requiredLength;
                break;
            default:
                conditionValue = null;
        }

        // Error Message is just a string 
        if (typeof (totalValidationErrorMessages[keys[0]]) == "string") return totalValidationErrorMessages[keys[0]];
        // Error Message is a function that take inputs and return string message
        else return totalValidationErrorMessages[keys[0]](this.businessName, conditionValue);
    }


    /**
     * Search for the control name inside its parent controls and return it
     */
    private _getControlName(): string | null {
        let controlName = null;
        const parent = this.control.parent;

        if (parent instanceof FormGroup) {
            for (const name in parent.controls) {
                if (this.control === parent.controls[name]) controlName = name;
            }
        }

        return controlName;
    }
}
