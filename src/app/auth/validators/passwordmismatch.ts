import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordField: string,
  confirmPasswordField: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordField);
    const confirmPassword = control.get(confirmPasswordField);

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  };
}
