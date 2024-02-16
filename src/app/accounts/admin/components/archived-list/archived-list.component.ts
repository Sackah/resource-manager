import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { UserDeleteModalComponent } from '@app/shared/components/modals/user-delete-modal/user-delete-modal.component';
import { UsersService } from '../../services/users.service';
import {
  GenericResponse,
  User,
  ArchivedUsersResponse,
} from '../../../../shared/types/types';
import { CustomSpinnerComponent } from '@app/shared/components/custom-spinner/custom-spinner.component';

@Component({
  selector: 'app-archived-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent, CustomSpinnerComponent],
  templateUrl: './archived-list.component.html',
  styleUrls: [
    './archived-list.component.css',
    '../../../../auth/styles/styles.css',
  ],
})
export class ArchivedListComponent implements OnInit {
  public archivedUsers: User[] = [];

  public loading = false;

  @Output() selectedUsersEvent = new EventEmitter<User[]>();

  public showDropdownForUser: User | null = null;

  public currentPage = 1;

  public totalArchivedUsers = 0;

  public itemsPerPage = 10;

  public totalPages = 0;

  public successMessage: string | null = null;

  public errorMessage: string | null = null;

  selectedArchivedUsers: User[] = [];

  public showModalForUser: User | null = null;

  constructor(
    private usersService: UsersService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchArchivedUsers();
  }

  get isAnyArchivedUserSelected(): boolean {
    return this.selectedArchivedUsers.length > 0;
  }

  public isSelected(user: User): boolean {
    return this.selectedArchivedUsers.includes(user);
  }

  public selectAll(): void {
    this.selectedArchivedUsers = [...this.archivedUsers];
    this.selectedUsersEvent.emit(this.selectedArchivedUsers);
  }

  public deselectAll(): void {
    this.selectedArchivedUsers = [];
    this.selectedUsersEvent.emit(this.selectedArchivedUsers);
  }

  public toggleDropdown(user: User): void {
    this.showDropdownForUser = this.showDropdownForUser === user ? null : user;
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchArchivedUsers();
  }

  public openDeleteUserModal(archiveduser: User) {
    const modalRef = this.modalService.open(UserDeleteModalComponent);
    modalRef.componentInstance.archivedUsers = archiveduser;

    modalRef.result.then(result => {
      if (result === 'delete') {
        this.deleteUser(archiveduser);
      }
    });
  }

  public restoreSelected(): void {
    this.selectedArchivedUsers.forEach(user => {
      this.usersService.restoreUser(user.email).subscribe({
        next: () => {
          this.fetchArchivedUsers();
        },
        error: () => {
          this.errorMessage =
            'Server Error: Could not restore user, please try again later.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        },
      });
    });
  }

  private fetchArchivedUsers(): void {
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    const endIndex = startIndex + this.itemsPerPage;

    this.usersService.archivedUsers().subscribe({
      next: (response: ArchivedUsersResponse) => {
        const archivedUsers = response?.archives || [];
        if (Array.isArray(archivedUsers)) {
          this.archivedUsers = archivedUsers as User[];
          this.totalArchivedUsers = archivedUsers.length;
          this.archivedUsers = archivedUsers.slice(
            startIndex,
            endIndex
          ) as User[];

          this.totalPages = Math.ceil(archivedUsers.length / this.itemsPerPage);
        } else {
          archivedUsers;
        }
      },
      error: error => {
        error;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public restoreUser(email: string): void {
    this.loading = true;
    this.usersService.restoreUser(email).subscribe({
      next: response => {
        this.successMessage = response.message;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.fetchArchivedUsers();
      },

      error: () => {
        this.errorMessage =
          'Server Error: Could not restore user, please try again later.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  deleteUser(user: User): void {
    if (!user) {
      return;
    }

    this.usersService.deleteUser(user.email).subscribe({
      next: (response: GenericResponse) => {
        this.successMessage = response.message;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.fetchArchivedUsers();
      },
      error: () => {
        this.errorMessage =
          'Server Error: Could not delete user, please try again later.';

        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }
}
