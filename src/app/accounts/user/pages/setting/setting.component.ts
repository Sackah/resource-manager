import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SideNavComponent } from '../../../../shared/components/side-nav/side-nav.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { UserProfile } from '../../components/user-profile/user-profile.component';

@Component({
  selector: 'setting',
  standalone: true,
  imports: [CommonModule, SideNavComponent, HeaderComponent, UserProfile],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent {}
