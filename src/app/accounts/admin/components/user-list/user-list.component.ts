import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ComponentRef,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User, UsersResponse } from '@app/shared/types/types';
import { ViewModalComponent } from '@app/shared/components/modals/view-modal/view-modal.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { AssignModalComponent } from '@app/shared/components/modals/assign-modal/assign-modal.component';
import { AssignModalService } from '@app/shared/components/modals/assign-modal/assign.service';
import { ViewModalService } from '@app/shared/components/modals/view-modal/view-modal.service';
import { ButtonAssignComponent } from '@app/accounts/user/components/button-assign/button-assign.component';
import { EditUserModalComponent } from '@app/shared/components/modals/edit-user-modal/edit-user-modal.component';
import { UpdateUserDetails } from '@app/auth/types/auth-types';
import { EditUserModalService } from '@app/shared/components/modals/edit-user-modal/edit-user.service';
import { UsersService } from '../../services/users.service';
import { UserListService } from './user-list.service';
import { CustomSpinnerComponent } from '@app/shared/components/custom-spinner/custom-spinner.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ViewModalComponent,
    PaginationComponent,
    AssignModalComponent,
    ButtonAssignComponent,
    CustomSpinnerComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: [
    './user-list.component.css',
    '../../../../auth/styles/styles.css',
  ],
})
export class UserListComponent implements OnInit, OnDestroy {
  public users: User[] = [];

  newDetails!: UpdateUserDetails;

  public currentPage = 1;

  public itemsPerPage = 10;

  public totalPages = 0;

  public loading = false;

  public showDropdownForUser: User | null = null;

  public successMessage: string | null = null;

  public errorMessage: string | null = null;

  public totalUsers = 0;

  selectedUsers: User[] = [];

  @Output() selectedUsersEvent = new EventEmitter<User[]>();

  private dataSubscription: Subscription | undefined;

  private viewModalRef?: ComponentRef<ViewModalComponent>;

  private editModalRef?: ComponentRef<EditUserModalComponent>;

  constructor(
    private usersService: UsersService,
    private viewContainerRef: ViewContainerRef,
    private assignModalService: AssignModalService,
    private viewModalService: ViewModalService,
    private modalService: NgbModal,
    private editModalService: EditUserModalService,
    private userListService: UserListService
  ) {}

  ngOnInit(): void {
    this.dataSubscription = this.userListService.refreshUsers$.subscribe(() => {
      this.fetchUsers();
    });
  }

  get isAnyUserSelected(): boolean {
    return this.selectedUsers.length > 0;
  }

  public toggleDropdown(user: User): void {
    this.showDropdownForUser = this.showDropdownForUser === user ? null : user;
  }

  public openViewModal(user: User) {
    this.viewModalRef = this.viewModalService.open(this.viewContainerRef, {
      user,
    });
  }

  public openEditUserModal(user: User) {
    this.editModalRef = this.editModalService.open(this.viewContainerRef, {
      user,
    });
    this.editModalRef.instance.closeEvent.subscribe(() => {
      this.userListService.refreshUsers();
    });
  }

  public editUser(user: User): void {
    if (!user) {
      return;
    }

    this.usersService.updateDetails(this.newDetails).subscribe({
      next: updatedUser => {
        updatedUser;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: () => {
        this.errorMessage =
          'Server Error: Could not edit user, please try again later.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  public toggleUserSelection(user: User): void {
    if (this.isSelected(user)) {
      this.selectedUsers = this.selectedUsers.filter(u => u !== user);
    } else {
      this.selectedUsers.push(user);
    }

    this.selectedUsersEvent.emit(this.selectedUsers);
  }

  public isSelected(user: User): boolean {
    return this.selectedUsers.includes(user);
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchUsers();
  }

  public selectAll(): void {
    this.selectedUsers = [...this.users];
    this.selectedUsersEvent.emit(this.selectedUsers);
  }

  public deselectAll(): void {
    this.selectedUsers = [];
    this.selectedUsersEvent.emit(this.selectedUsers);
  }

  public deleteSelected(): void {
    this.selectedUsers.forEach(user => {
      this.usersService.deleteUser(user.refId).subscribe({
        next: () => {
          this.fetchUsers();
        },
        error: () => {
          this.errorMessage =
            'Server Error: Could not delete user, please try again later.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        },
      });
    });
  }

  public archiveSelected(): void {
    this.selectedUsers.forEach(user => {
      this.usersService.archiveUser(user.email).subscribe({
        next: response => {
          this.successMessage = response.message;
          this.fetchUsers();
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: () => {
          this.errorMessage =
            'Server Error: Could not archive user, please try again later.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        },
      });
    });
  }

  public restoreSelected(): void {
    this.selectedUsers.forEach(user => {
      this.usersService.restoreUser(user.refId).subscribe({
        next: () => {
          this.fetchUsers();
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

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchUsers(): void {
    this.loading = true;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    const endIndex = startIndex + this.itemsPerPage;

    this.usersService.getUsers().subscribe({
      next: (response: UsersResponse) => {
        const users = response?.users || [];
        if (Array.isArray(users)) {
          this.users = users.slice(startIndex, endIndex) as User[];

          this.totalUsers = users.length;
          this.totalPages = Math.ceil(users.length / this.itemsPerPage);
        } else {
          users;
        }
      },
      error: error => {
        error;
        this.errorMessage = 'Error fetching users, please try again';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public archiveUser(user: User): void {
    this.loading = true;
    this.usersService.archiveUser(user.email).subscribe({
      next: response => {
        this.successMessage = response.message;
        this.fetchUsers();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },

      error: () => {
        this.errorMessage =
          'Server Error: Could not archive user, please try again later.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }
}
