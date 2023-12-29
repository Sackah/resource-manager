import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SideNavComponent } from '../../../../shared/components/side-nav/side-nav.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { UserProfileComponent } from '../../components/user-profile/user-profile.component';
import { UserPasswordComponent } from '../../components/user-password/user-password.component';
import {
  SettingsFields,
  SettingsService,
} from '../../services/settings.service';

@Component({
  selector: 'setting',
  standalone: true,
  imports: [
    CommonModule,
    SideNavComponent,
    HeaderComponent,
    UserProfileComponent,
    UserPasswordComponent,
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent {
  settingsField: SettingsFields = 'profile';

  constructor(private settingService: SettingsService) {
    this.settingService.data.subscribe({
      next: field => {
        this.settingsField = field;
      },
    });
  }

  changeField($event: Event, field: SettingsFields) {
    this.settingService.toggle(field);
  }
}
