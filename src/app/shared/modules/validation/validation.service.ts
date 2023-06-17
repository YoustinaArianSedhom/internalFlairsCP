import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { validationErrorMessages } from './config/validation-messages';
import { validationPatterns } from './config/validation-patterns';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() { }

  public readonly PATTERNS = validationPatterns;
  public readonly ERROR_MESSAGES = validationErrorMessages;

  // public patternValidator(
  //   regex: RegExp,
  //   error: ValidationErrors
  // ): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } => {
  //     if (!control.value) {
  //       // if control is empty return no error
  //       return null;
  //     }

  //     // test the value of the control against the regexp supplied
  //     const valid = regex.test(control.value);

  //     // if true, return no error (no error), else return error passed in the second parameter
  //     return valid ? null : error;
  //   };
  // }

  public passwordMatchValidator(
    controlName: string,
    matchingControlName: string
  ) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (
        matchingControl.errors &&
        !matchingControl.errors.passwordMatchValidator
      ) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMatchValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  public supportedFileTypes(supportedTypes: string[]) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control && control.value) {
        const fileName = control.value.files[0].name;
        const dotIndex = fileName.lastIndexOf('.');
        const fileExtension = fileName.slice(dotIndex + 1, fileName.length);
        if (!supportedTypes.includes(fileExtension))
          return { supportedExtensions: true };
      }
      return null;
    };
  }
  /**
   * check white spaces validation
   */

  public whiteSpacesOnlyValidation(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value.trim().length == 0) return { onlySpace: true };
      return null
    }
  }


  public validateSpacesInBetween(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value.trim().includes(" ")) return { includeSpace: true };
      return null
    }

  }

  /**
   * check if entered value is included in an autocomplete list
   * remember to use [custom validation error in <app-validation-error>]
   */
  public autocompleteStringValidator(validOptions: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (validOptions.indexOf(control.value) !== -1) {
        return null  /* valid option selected */
      }
      return { invalidAutocompleteString: true }
    }
  }
  /**
   * Check if control value consists of numbers only
   */
  public numbersOnlyValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value && !this.PATTERNS.numbersOnly.test(control.value)) {
        return { numberOnly: true };
      }
      return null;
    };
  }

  /**
   * Check if control value is a valid url
   */
  public urlValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value && !this.PATTERNS.url.test(control.value)) {
        return { invalidUrl: true };
      }
      return null;
    };
  }

  /**
   * Check if a given number meet the max or number criteria
   */
  public MaxMinNumberValidator(
    type: string = 'max',
    numberToCheck: number
  ): ValidatorFn {
    return (
      control: AbstractControl
    ): { [key: string]: boolean | number | string } | null => {
      let value;
      let isValid = true;

      if (!control.value) value = '0';
      else value = parseInt(control.value, 10);

      type === 'max'
        ? (isValid = numberToCheck >= value)
        : (isValid = numberToCheck <= value);

      if (isValid) return null;
      return { [`${type}Number`]: numberToCheck };
    };
  }

  /**
   * Check if a control value contains a valid duration
   */
  public durationValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value && !this.PATTERNS.duration.test(control.value)) {
        return { invalidDuration: true };
      }
      return null;
    };
  }

  /**
   * Check if a control value contains a valid duration
   */
  public positiveIntegersValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (
        control.value &&
        !this.PATTERNS.positiveIntegers.test(control.value)
      ) {
        return { positiveIntegers: true };
      }
      return null;
    };
  }

  /**
   * Check if a control value contains a valid positive numbers
   */
  public positiveDoubleValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value && !this.PATTERNS.positiveNumbers.test(control.value)) {
      }

      return null;
    };
  }

  public bankAccountNumberValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value && !this.PATTERNS.bankAccountNumber.test(control.value))
        return { bankAccountNumber: true };
      return null;
    };
  }

  /*_____________ Group Validators ________________*/

  /**
   * Check if two form group controls have a valid range between their values
   */
  public rangeValidator(
    fromCTRL: { name: string; label: string },
    toCTRL: { name: string; label: string },
    checkEquality: boolean = false
  ) {
    return (formGroup: FormGroup) => {
      const { value: fromValue } = formGroup.get(fromCTRL.name);
      const { value: toValue } = formGroup.get(toCTRL.name);

      if (fromValue && toValue) {
        if (fromValue > toValue || (checkEquality && fromValue == toValue))
          return {
            rangeError: `${fromCTRL.label} value must be less than ${toCTRL.label} value`,
          };
      }
      return null;
    };
  }
}
