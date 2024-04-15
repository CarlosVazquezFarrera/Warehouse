import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function onlyNumbers(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = new RegExp('^[0-9]*$');
    const valid = regex.test(control.value)
    return valid ? null : { onlyNumbers: true };
  };
}
