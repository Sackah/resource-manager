import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validPhoneNumber(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const isValid = /^[0-9]{10}$/.test(value);

  return isValid ? null : { invalidPhoneNumber: true };
}
