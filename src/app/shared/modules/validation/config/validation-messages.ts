/**
 * 
 * this file is the only place for all general validation error messages or the shared ones over the whole system
 * @summary It takes the control name as first input to get its name form 
 *  and if it needs another input which can help into outputting a more descriptive message, 
 *  you can take another input based on validation case alongside targeted message
 */
export const validationErrorMessages: {[key: string]: any} = {
    required: (field: string) => `${field} is required!`,
    email: (field: string) => `${field} must be a valid email address!`,
    min: (field: string, value: number) => `${field} minimum values is ${value}!`,
    max: (field: string, value: number) => `${field} maximum values is ${value}!`,
    minlength: (field: string, length: number) => `${field} should have minimum ${length} characters!`,
    maxlength: (field: string, length: number) => `${field} should have maximum ${length} characters!`,
    minContentSize: (field: string, length: number) => `${field} should have minimum size ${length}!`,
    maxContentSize: (field: string, length: number) => `${field} should have maximum size ${length}!`,
    minNumber: (field: string, value: number) => `${field} minimum values is ${value}!`,
    maxNumber: (field: string, value: number) => `${field} maximum values is ${value}!`,
    pattern: (field: string) => `${field} have incorrect format!`,
    samePassword: (field: string) => `${field} must not be the same as the Old ${field}!`,
    passwordMatchValidator: 'Passwords must match!',
    hasNumber: (field: string) => `${field} should have minimum 1 numbers!`,
    hasCapitalCase: (field: string) => `${field} should have minimum 1 Letters in Capital Case!`,
    hasSmallCase: (field: string) => `${field} should have minimum 1 Letters in Small Case!`,
    hasSpecialCharacters: (field: string) => `${field} should have minimum 1 Special Characters!`,
    onlySpace: (field: string) => `${field} value consists of white space only!`,
    includeSpace:(field:string)=>`${field} value has white spaces in between`,
    invalidUrl: (field: string) => `${field} have incorrect format!`,
    numbersOnly: (field: string) => `${field} value must consists of numbers only`,
    positiveIntegers: (field: string) => `${field} value must consists of positive numbers only`,
    positiveNumbers: (field: string) => `${field} value must consists fof positive numbers only`,
    bankAccountNumber: (field: string) => `${field} Must have value with 3 numbers groups separated by two dashes`
};
