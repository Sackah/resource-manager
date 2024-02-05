import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
} from '@angular/core';

import { User, ProjectDetails } from '../../../types/types';
import { UsersService } from '../../../../accounts/admin/services/users.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-modal.component.html',
  styleUrl: './assign-modal.component.css',
})
export class AssignModalComponent implements AfterViewInit {
  @Input() user!: User;
  @Input() users: User[] = [];
  @Input() project!: ProjectDetails;
  opening: boolean = false;
  closed: boolean = false;
  loading: boolean = false;
  bookableUsers: User[] = [];
  searchQuery: string = '';
  query: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  response: string | null = null;
  isSubmitting: boolean = false;
  checkedUsers: { [userId: string]: boolean } = {};

  @Output() closeEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();
  selectedUsersEvent = new EventEmitter<User[]>();
  selectedUsers: User[] = [];

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  closeErrorMessage(): void {
    this.errorMessage = null;
  }

  closeSuccessMessage(): void {
    this.successMessage = null;
  }

  close() {
    this.closed = true;
    this.closeEvent.emit();
  }

  edit() {}

  handleCheck(user: User): void {
    this.checkedUsers[user.userId] = !this.checkedUsers[user.userId];
  }

  submit(): void {
    this.usersService
      .assignUser(
        this.project.name,
        this.bookableUsers
          .filter(user => user.selected)
          .map(user => user.userId)
      )
      .subscribe({
        next: (response: any) => {
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error: any) => {
          if (error.status >= 500) {
            this.errorMessage =
              'Server Error" Something went wrong on the server.';
          } else {
            if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'An unexpected error occured.';
            }
          }

          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        },
        complete: () => {
          this.close();
          this.isSubmitting = false;
        },
      });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.opening = false;
    }, 100);

    this.fetchBookableUsers(this.query);
  }

  ngAfterViewInit(): void {
    this.fetchBookableUsers(this.query);
  }

  onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.fetchBookableUsers(query);
  }

  fetchBookableUsers(query: string): void {
    this.loading = true;
    this.usersService.getBookableUsers(query).subscribe({
      next: (response: any) => {
        const bookableUsers = response.users || response.data;
        if (Array.isArray(bookableUsers)) {
          this.bookableUsers = bookableUsers as User[];

          this.bookableUsers.forEach(user => {
            user.selected = this.checkedUsers[user.userId] || false;
          });
        } else {
        }
      },
      error: error => {
        error;
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get modalClasses() {
    return {
      [`modal`]: true,
      [`opening`]: this.opening,
      [`closed`]: this.closed,
    };
  }

  get backdropClasses() {
    return {
      [`backdrop`]: true,
      [`opening`]: this.opening,
      [`closed`]: this.closed,
    };
  }
}
