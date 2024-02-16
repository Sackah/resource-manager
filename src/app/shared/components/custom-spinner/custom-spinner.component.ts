import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-spinner.component.html',
  styleUrl: './custom-spinner.component.css',
})
export class CustomSpinnerComponent {}
