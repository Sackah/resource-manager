import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SideNavComponent } from '../../../../shared/components/side-nav/side-nav.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import {
  SettingsFields,
  SettingsService,
} from '../../../user/services/settings.service';
import { UserProfileComponent } from '../../../user/components/user-profile/user-profile.component';
import { UserPasswordComponent } from '../../../user/components/user-password/user-password.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    SideNavComponent,
    HeaderComponent,
    UserProfileComponent,
    UserPasswordComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  settingsField: SettingsFields = 'profile';

  constructor(private settingsService: SettingsService) {
    this.settingsService.data.subscribe({
      next: field => {
        this.settingsField = field;
      },
    });
  }

  changeField($event: Event, field: SettingsFields) {
    this.settingsService.toggle(field);
  }
}
