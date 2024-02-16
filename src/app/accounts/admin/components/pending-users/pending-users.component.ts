import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { User, UsersResponse } from '@app/shared/types/types';
import { Subscription } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { CustomSpinnerComponent } from '@app/shared/components/custom-spinner/custom-spinner.component';

@Component({
  selector: 'app-pending-users',
  standalone: true,
  imports: [CommonModule, PaginationComponent, CustomSpinnerComponent],
  templateUrl: './pending-users.component.html',
  styleUrls: [
    './pending-users.component.css',
    '../../../../auth/styles/styles.css',
  ],
})
export class PendingUsersComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | null = null;

  public users: User[] = [];

  public currentPage = 1;

  public itemsPerPage = 10;

  public totalPages = 0;

  public showDropdownForUser: User | null = null;

  public loading = false;

  public errorMessage: string | null = null;

  public successMessage: string | null = null;

  public totalPendingUsers = 0;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.fetchPendingUsers();
  }

  public toggleDropdown(user: User): void {
    this.showDropdownForUser = this.showDropdownForUser === user ? null : user;
  }

  private fetchPendingUsers(): void {
    this.loading = true;

    this.dataSubscription = this.usersService.getPendingUsers().subscribe({
      next: (response: UsersResponse) => {
        const users = response?.users || [];
        if (Array.isArray(users)) {
          this.users = users;
          this.totalPendingUsers = users.length;
          this.totalPages = Math.ceil(users.length / this.itemsPerPage);
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Server Error: Could not fetch pending projects.';
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

  public sendInvitation(user: User): void {
    this.loading = true;
    this.usersService.reInviteUser(user.email).subscribe({
      next: () => {
        this.successMessage = 'Invitation sent successfully';
        this.fetchPendingUsers();
      },
      error: () => {
        this.errorMessage =
          'Server Error: Could not re-invite user, please try again later.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchPendingUsers();
  }
}
