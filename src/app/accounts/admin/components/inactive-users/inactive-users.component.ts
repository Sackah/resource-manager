import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, UsersResponse } from '@app/shared/types/types';
import { Subscription } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { CustomSpinnerComponent } from '@app/shared/components/custom-spinner/custom-spinner.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-inactive-users',
  standalone: true,
  imports: [CommonModule, CustomSpinnerComponent, PaginationComponent],
  templateUrl: './inactive-users.component.html',
  styleUrls: [
    './inactive-users.component.css',
    '../../../../auth/styles/styles.css',
  ],
})
export class InactiveUsersComponent implements OnInit, OnDestroy {
  public dataSubscription: Subscription | null = null;

  public users: User[] = [];

  public loading = false;

  public currentPage = 1;

  public itemsPerPage = 10;

  public totalPages = 0;

  public totalInactiveUsers = 0;

  public successMessage = '';

  public errorMessage = '';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.fetchInactiveUsers();
  }

  public fetchInactiveUsers(): void {
    this.loading = true;

    this.dataSubscription = this.usersService.getInactiveUsers().subscribe({
      next: (response: UsersResponse) => {
        const users = response?.users || [];
        if (Array.isArray(users)) {
          this.users = users;
          this.totalInactiveUsers = users.length;
          this.totalPages = Math.ceil(users.length / this.itemsPerPage);
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to fetch inactive users';
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
    this.fetchInactiveUsers();
  }
}
