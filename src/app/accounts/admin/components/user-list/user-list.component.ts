import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ComponentRef,
  EventEmitter,
  Output,
  Input,
  ViewChild,
} from '@angular/core';
import { User, GenericResponse } from '../../../../shared/types/types';
import { Subscription } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { ViewModalComponent } from '../../../../shared/components/modals/view-modal/view-modal.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AssignModalComponent } from '../../../../shared/components/modals/assign-modal/assign-modal.component';
import { AssignModalService } from '../../../../shared/components/modals/assign-modal/assign.service';
import { ViewModalService } from '../../../../shared/components/modals/view-modal/view-modal.service';
import { GeneralAssignModalService } from '../../../../shared/components/modals/general-assign-modal/general-assign-modal.service';
import { GeneralAssignModalComponent } from '../../../../shared/components/modals/general-assign-modal/general-assign-modal.component';
import { ButtonAssignComponent } from '../../../user/components/button-assign/button-assign.component';
import { EditUserModalComponent } from '../../../../shared/components/modals/edit-user-modal/edit-user-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateUserDetails } from '../../../../auth/types/auth-types';
import { EditUserModalService } from '../../../../shared/components/modals/edit-user-modal/edit-user.service';
import { UserListService } from './user-list.service';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ViewModalComponent,
    PaginationComponent,
    AssignModalComponent,
    ButtonAssignComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  public users: User[] = [];
  @Input() user: User[] = [];
  newDetails!: UpdateUserDetails;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public totalPages: number = 0;
  public loading = false;
  public showDropdownForUser: User | null = null;
  public successMessage: string | null = null;
  public errorMessage: string | null = null;
  public totalUsers: number = 0;
  selectedUsers: User[] = [];
  @Output() selectedUsersEvent = new EventEmitter<User[]>();

  private dataSubscription: Subscription | undefined;
  private viewModalRef?: ComponentRef<ViewModalComponent>;
  private assignModalRef?: ComponentRef<GeneralAssignModalComponent>;
  private editModalRef?: ComponentRef<EditUserModalComponent>;

  constructor(
    private usersService: UsersService,
    private viewContainerRef: ViewContainerRef,
    private assignModalService: AssignModalService,
    private viewModalService: ViewModalService,
    private generalAssignModalService: GeneralAssignModalService,
    private modalService: NgbModal,
    private editModalService: EditUserModalService,
    private userListService: UserListService
  ) {}

  ngOnInit(): void {
    this.dataSubscription = this.userListService.refreshUsers$.subscribe(() => {
      this.fetchUsers();
    });
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

  public openGeneralAssignModal() {
    this.assignModalRef = this.generalAssignModalService.open(
      this.viewContainerRef,
      {
        users: this.selectedUsers,
      }
    );
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
      next: (response: any) => {
        const users = response.users || response.data;
        if (Array.isArray(users)) {
          this.users = users.slice(startIndex, endIndex) as User[];
          this.totalUsers = users.length;
          this.totalPages = Math.ceil(users.length / this.itemsPerPage);
        } else {
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

  public archiveUser(user: User): void {
    this.loading = true;
    this.usersService.archiveUser(user.email).subscribe({
      next: (response: any) => {
        this.successMessage = response.message;
        this.fetchUsers();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },

      error: () => {
        (this.errorMessage =
          'Server Error: Could not archive user, please try again later.'),
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
      },
    });
  }
}
