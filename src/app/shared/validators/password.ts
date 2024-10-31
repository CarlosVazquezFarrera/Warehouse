import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordComplexityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{1,}$');
      const valid = regex.test(control.value)
      return valid ? null : { passwordComplexity: true };
    };
  }
  