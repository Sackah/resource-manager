import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private errors: string[] = [];

  handleError(error: string): void {
    this.errors.push(error);
  }

  getErrors(): string[] {
    return this.errors;
  }

  clearErrors(): void {
    this.errors = [];
  }
}
