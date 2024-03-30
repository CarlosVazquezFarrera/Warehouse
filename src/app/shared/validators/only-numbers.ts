import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


// export function onlyNumbers(control: AbstractControl) {
//   if (!control.value) {
//     return;
//   }
//   const regex = new RegExp('^[0-9]*$');
//   const valid = regex.test(control.value)
//   console.log(valid)
//   return valid ? null : { onlyNumbers: true }
// }

/** A hero's name can't match the given regular expression */
export function onlyNumbers(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = new RegExp('^[0-9]*$');
    const valid = regex.test(control.value)
    return valid ? null : { onlyNumbers: true };
  };
}
