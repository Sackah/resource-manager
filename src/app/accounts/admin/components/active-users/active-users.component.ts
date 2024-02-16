import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { User, UsersResponse } from '@app/shared/types/types';
import { UsersService } from '../../services/users.service';
import { CustomSpinnerComponent } from '@app/shared/components/custom-spinner/custom-spinner.component';

@Component({
  selector: 'app-active-users',
  standalone: true,
  imports: [CommonModule, PaginationComponent, CustomSpinnerComponent],
  templateUrl: './active-users.component.html',
  styleUrls: [
    './active-users.component.css',
    '../../../../auth/styles/styles.css',
  ],
})
export class ActiveUsersComponent implements OnInit, OnDestroy {
  public dataSubscription: Subscription | null = null;

  public users: User[] = [];

  public loading = false;

  public currentPage = 1;

  public itemsPerPage = 10;

  public totalPages = 0;

  public totalActiveUsers = 0;

  public successMessage = '';

  public errorMessage = '';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.fetchActiveUsers();
  }

  private fetchActiveUsers(): void {
    this.loading = true;
    this.dataSubscription = this.usersService.getActiveUsers().subscribe({
      next: (response: UsersResponse) => {
        const users = response?.users || [];
        if (Array.isArray(users)) {
          this.users = users;
          this.totalActiveUsers = users.length;
          this.totalPages = Math.ceil(users.length / this.itemsPerPage);
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to fetch active users';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchActiveUsers();
  }
}
