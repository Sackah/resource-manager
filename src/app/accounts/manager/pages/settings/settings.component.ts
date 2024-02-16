import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkSpecializationComponent } from '@app/accounts/user/components/work-specialization/work-specialization.component';
import { UserPasswordComponent } from '@app/accounts/user/components/user-password/user-password.component';
import { UserProfileComponent } from '@app/accounts/user/components/user-profile/user-profile.component';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { SideNavComponent } from '@app/shared/components/side-nav/side-nav.component';
import {
  SettingsFields,
  SettingsService,
} from '../../../user/services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    SideNavComponent,
    HeaderComponent,
    UserProfileComponent,
    UserPasswordComponent,
    WorkSpecializationComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnDestroy {
  public subscriptions: Subscription[] = [];

  public settingsField: SettingsFields = 'profile';

  constructor(private settingsService: SettingsService) {
    const settingsSub = this.settingsService.data.subscribe({
      next: field => {
        this.settingsField = field;
      },
    });
    this.subscriptions.push(settingsSub);
  }

  public changeField($event: Event, field: SettingsFields) {
    this.settingsService.toggle(field);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
