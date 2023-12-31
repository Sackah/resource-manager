import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { Notifications } from './header-dummy-data';
import { CdkMenuModule } from '@angular/cdk/menu';

@Component({
  selector: 'rm-header',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchComponent, CdkMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  query: string = '';
  notifications = Notifications;
  isOnline: boolean = navigator.onLine;

  ngOnInit() {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  private updateOnlineStatus(online: boolean) {
    this.isOnline = online;
  }

  performSearch() {}
}
