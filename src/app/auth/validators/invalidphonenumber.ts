import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validPhoneNumber(
  control: AbstractControl
): ValidationErrors | null {
  const { value } = control;

  if (!value) {
    return null;
  }

  const isValid = /^[0-9]{10,12}$/.test(value);

  return isValid ? null : { invalidPhoneNumber: true };
}
