import { FormGroup, AbstractControl } from '@angular/forms';

export function provideReactiveFormGetters(form: FormGroup, suffix: string = "Control"): {[key: string]: AbstractControl} {
    const controlsGetters = {};
    Object.keys(form.controls).forEach((key: string) => {
        controlsGetters[key + suffix] = form.controls[key];
    });
    return controlsGetters;
}
