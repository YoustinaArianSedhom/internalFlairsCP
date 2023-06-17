/**
 * This file is the only place for all general or shared patterns that used for validation purposes 
 * cross over the whole system
 * 
 * @summary List of validation REGX patterns which can be used with angular Validators.pattern or custom REGX test
 */

export const validationPatterns = {
    url: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
    numbersOnly: /^[0-9]*$/,
    positiveNumbers: /^[+]?\d+([.]\d+)?$/,
    positiveIntegers: /^\d+$/,
    duration: /^[+]?\d+([.]\d+)?$/,
    mobile: /^[\s()+-]*([0-9][\s()+-]*){6,20}$/,
    mobileAlt: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
    phoneNumber: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
    customDomain: /(@){1}(([a-zA-z0-9]+(\-+[a-zA-z0-9]+)*\.{1}[a-zA-z0-9]+(\.{1}[a-zA-z0-9]+)*)|([0-9]{1,3}(\.{1}[0-9]{1,3}){3})|([0-9a-fA-F]{1,4}(\:{1}[0-9a-fA-F]{1,4}){7}))[^_]$/,
    englishChars: /^[a-zA-Z ]+$/,
    bankAccountNumber: /^[0-9]+-[0-9]+-[0-9]+$/
}