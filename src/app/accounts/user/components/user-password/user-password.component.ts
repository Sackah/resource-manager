import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'user-password',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-password.component.html',
  styleUrls: [
    './user-password.component.css',
    '../../pages/setting/setting.component.css',
  ],
})
export class UserPasswordComponent {
  showPassword: boolean = false;

  get passwordField() {
    return this.showPassword ? 'text' : 'password';
  }
}
