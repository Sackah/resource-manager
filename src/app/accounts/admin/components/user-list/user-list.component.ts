import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { GenericResponse, User } from '../../../../shared/types/types';
import { Subscription } from 'rxjs';
import { CreateUserService } from '../../services/create-user.service';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { ViewModalComponent } from '../../../../shared/components/modals/view-modal/view-modal.component';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DeleteModalComponent } from '../../../../shared/components/modals/delete-modal/delete-modal.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ViewModalService } from '../../../../shared/components/modals/view-modal/view-modal.service';
import { DeleteModalService } from '../../../../shared/components/modals/delete-modal/delete-modal.service';
import { AssignModalComponent } from '../../../../shared/components/modals/assign-modal/assign-modal.component';
import { AssignModalService } from '../../../../shared/components/modals/assign-modal/assign.service';
import { DropdownService } from '../../../../shared/components/dropdown/dropdown.service';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [
    CommonModule,
    ViewModalComponent,
    PaginationComponent,
    DeleteModalComponent,
    AssignModalComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  loading: boolean = false;
  showDropdownForUser: User | null = null;

  private dataSubscription: Subscription | undefined;
  private viewModalRef?: ComponentRef<ViewModalComponent>;
  private assignModalRef?: ComponentRef<AssignModalComponent>;
  private dropdownRef?: ComponentRef<DropdownComponent>;

  constructor(
    private usersService: UsersService,
    private dropdownService: DropdownService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  openDropdown(event: MouseEvent, user: User) {
    const position = {
      top: event.clientY + 20,
      left: event.clientX - 100,
    };
    this.dropdownRef = this.dropdownService.open(
      this.viewContainerRef,
      user,
      position
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchUsers();
  }

  toggleDropdown(user: User): void {
    // Toggle the dropdown for the specified user
    this.showDropdownForUser = this.showDropdownForUser === user ? null : user;
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
          this.totalPages = Math.ceil(users.length / this.itemsPerPage);
        } else {
          console.error('Invalid response format for users:', users);
        }
      },
      error: error => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
