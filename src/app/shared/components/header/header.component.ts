import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { Notifications } from './header-dummy-data';
import { CdkMenuModule } from '@angular/cdk/menu';

@Component({
  selector: 'header',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchComponent, CdkMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  query: string = '';

  notifications = Notifications;

  performSearch() {}
}
