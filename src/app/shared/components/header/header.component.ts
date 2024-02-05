import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { NotificationsService } from '../../services/notifications.service';
import { UserNotifications, User } from '../../types/types';
import { CurrentUserService } from '../../../auth/services/current-user.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchComponent, CdkMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  query: string = '';
  notifications: UserNotifications[] = [];
  isOnline: boolean = navigator.onLine;
  hasNewNotifications: boolean = false;
  userName: string = '';
  userEmail: string = '';

  constructor(
    private notificationService: NotificationsService,
    private currentUserService: CurrentUserService
  ) {}

  ngOnInit() {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
    this.fetchNotifications();
    this.fetchUserName();
  }

  private updateOnlineStatus(online: boolean) {
    this.isOnline = online;
  }

  private fetchUserName() {
    this.currentUserService.get().subscribe(
      (response: any) => {
        const currentUser = response.user;
        this.userName = `${currentUser.firstName} ${currentUser.lastName}`;
        this.userEmail = `${currentUser.email}`;
      },
      error => {
        error;
      }
    );
  }

  performSearch() {}

  private fetchNotifications() {
    this.notificationService.getNotifications().subscribe(
      (response: any) => {
        const notifications = response.notifications || response.data;
        if (Array.isArray(notifications)) {
          this.notifications = notifications as UserNotifications[];
        } else {
          notifications;
        }
      },
      error => {
        error;
      }
    );
  }

  markAllAsRead() {
    this.currentUserService.get().subscribe(
      (response: any) => {
        const currentUser = response.user;
        this.notificationService.markAllAsRead(currentUser.email).subscribe(
          (markAsReadResponse: any) => {
            markAsReadResponse;

            this.fetchNotifications();
          },
          error => {
            error;
          }
        );
      },
      error => {
        error;
      }
    );
  }
}
