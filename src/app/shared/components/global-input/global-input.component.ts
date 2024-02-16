import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  AbstractControl,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-global-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './global-input.component.html',
  styleUrl: './global-input.component.css',
})
export class GlobalInputComponent implements OnInit {
  @Input() id: string = '';

  @Input() type: string = '';

  @Input() value: string = '';

  @Input() placeholder: string = '';

  @Input() name: string = '';

  @Input() globalClass: string = '';

  @Input() control: FormControl | AbstractControl | any;

  @Input() label: string = '';

  @Input() required: boolean = false;

  @Input() class: string = '';

  @Input() errorType: string = 'required';

  @Input() errorMessage: string = 'Field is required';

  @Input() showPassword: boolean = false;

  ngOnInit(): void {
    if (this.control) {
      this.control.valueChanges.subscribe(() => {
        this.value;
      });
    }
  }

  showErrorMessage(): boolean {
    if (this.control) {
      return this.control.hasError(this.errorType) && this.control.dirty;
    }
    return false;
  }

  classError(): string {
    if (this.control) {
      return this.control.hasError(this.errorType) && this.control.dirty
        ? 'error'
        : '';
    }
    return '';
  }
}
